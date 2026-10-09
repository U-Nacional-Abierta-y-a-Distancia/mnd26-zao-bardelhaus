package com.narrativa.morichal.controlador.mqtt;

import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.narrativa.morichal.controlador.dto.LecturaSensorDto;
import com.narrativa.morichal.dominio.servicio.DatoMorichalService;

import jakarta.annotation.PreDestroy;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Component
public class SensoresMqttListener implements MqttCallbackExtended {

	private static final int SEGUNDOS_ENTRE_REINTENTOS = 30;

	private final DatoMorichalService datoMorichalService;
	private final ObjectMapper objectMapper;
	private final Validator validator;

	private final boolean habilitado;
	private final String broker;
	private final String usuario;
	private final String clave;
	private final String topico;
	private final ScheduledExecutorService reintentos = Executors.newSingleThreadScheduledExecutor();

	private MqttClient cliente;

	public SensoresMqttListener(
			DatoMorichalService datoMorichalService,
			ObjectMapper objectMapper,
			Validator validator,
			@Value("${morichal.mqtt.habilitado:false}") boolean habilitado,
			@Value("${morichal.mqtt.broker}") String broker,
			@Value("${morichal.mqtt.usuario}") String usuario,
			@Value("${morichal.mqtt.clave}") String clave,
			@Value("${morichal.mqtt.topico}") String topico) {
		this.datoMorichalService = datoMorichalService;
		this.objectMapper = objectMapper;
		this.validator = validator;
		this.habilitado = habilitado;
		this.broker = broker;
		this.usuario = usuario;
		this.clave = clave;
		this.topico = topico;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void iniciar() {
		if (!habilitado) {
			log.info("Listener MQTT deshabilitado");
			return;
		}
		try {
			cliente = new MqttClient(broker, "morichal-back-" + UUID.randomUUID(), new MemoryPersistence());
			cliente.setCallback(this);
		} catch (MqttException ex) {
			log.error("Configuración MQTT inválida ({})", broker, ex);
			return;
		}
		conectar();
	}

	private void conectar() {
		MqttConnectOptions opciones = new MqttConnectOptions();
		opciones.setUserName(usuario);
		opciones.setPassword(clave.toCharArray());
		opciones.setAutomaticReconnect(true);
		opciones.setCleanSession(true);
		try {
			cliente.connect(opciones);
		} catch (MqttException ex) {
			log.warn("No se pudo conectar al broker MQTT {}, se reintenta en {} s: {}",
					broker, SEGUNDOS_ENTRE_REINTENTOS, ex.getMessage());
			reintentos.schedule(this::conectar, SEGUNDOS_ENTRE_REINTENTOS, TimeUnit.SECONDS);
		}
	}

	@Override
	public void connectComplete(boolean reconexion, String serverURI) {
		try {
			cliente.subscribe(topico, 1);
			log.info("{} al broker MQTT {}, escuchando el tópico '{}'",
					reconexion ? "Reconectado" : "Conectado", serverURI, topico);
		} catch (MqttException ex) {
			log.error("No se pudo suscribir al tópico '{}'", topico, ex);
		}
	}

	@Override
	public void messageArrived(String topic, MqttMessage mensaje) {
		String contenido = new String(mensaje.getPayload(), StandardCharsets.UTF_8);
		// Ninguna excepción debe salir de aquí: Paho cerraría la conexión.
		try {
			LecturaSensorDto lectura = objectMapper.readValue(contenido, LecturaSensorDto.class);

			Set<ConstraintViolation<LecturaSensorDto>> errores = validator.validate(lectura);
			if (!errores.isEmpty()) {
				log.warn("Lectura descartada {}: {}", contenido,
						errores.stream().map(ConstraintViolation::getMessage).toList());
				return;
			}

			datoMorichalService.registrarLectura(lectura.aModelo());
			log.info("Lectura registrada: {}", contenido);
		} catch (JacksonException ex) {
			log.warn("Mensaje MQTT con formato inválido descartado: {}", contenido);
		} catch (RuntimeException ex) {
			log.error("No se pudo registrar la lectura {}", contenido, ex);
		}
	}

	@Override
	public void connectionLost(Throwable causa) {
		log.warn("Se perdió la conexión con el broker MQTT, reconectando...", causa);
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {
	}

	@PreDestroy
	public void detener() {
		reintentos.shutdownNow();
		if (cliente != null && cliente.isConnected()) {
			try {
				cliente.disconnect();
			} catch (MqttException ex) {
				log.warn("Error cerrando la conexión MQTT", ex);
			}
		}
	}
}
