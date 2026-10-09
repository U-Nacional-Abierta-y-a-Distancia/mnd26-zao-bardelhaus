package com.narrativa.morichal.integracion.signal;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.narrativa.morichal.dominio.modelo.Reporte;
import com.narrativa.morichal.dominio.gateway.PublicacionComunidadGateway;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SignalPublicacionAdaptador implements PublicacionComunidadGateway {

	private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");

	private final boolean habilitado;
	private final String numero;
	private final String grupo;
	private final RestClient restClient;

	public SignalPublicacionAdaptador(
			@Value("${morichal.signal.habilitado:false}") boolean habilitado,
			@Value("${morichal.signal.url:http://localhost:8081}") String url,
			@Value("${morichal.signal.numero:}") String numero,
			@Value("${morichal.signal.grupo:}") String grupo) {
		this.habilitado = habilitado;
		this.numero = numero;
		this.grupo = grupo;

		SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
		requestFactory.setConnectTimeout(Duration.ofSeconds(5));
		requestFactory.setReadTimeout(Duration.ofSeconds(30));
		this.restClient = RestClient.builder()
				.baseUrl(url)
				.requestFactory(requestFactory)
				.build();
	}

	@Override
	public void publicarReporte(Reporte reporte) {
		if (!habilitado) {
			log.debug("Publicación en Signal deshabilitada, se omite el reporte");
			return;
		}

		List<String> adjuntos = reporte.getEvidencia() == null || reporte.getEvidencia().length == 0
				? List.of()
				: List.of(Base64.getEncoder().encodeToString(reporte.getEvidencia()));

		Map<String, Object> mensaje = Map.of(
				"number", numero,
				"recipients", List.of(grupo),
				"message", armarMensaje(reporte),
				"base64_attachments", adjuntos);

		restClient.post()
				.uri("/v2/send")
				.contentType(MediaType.APPLICATION_JSON)
				.body(mensaje)
				.retrieve()
				.toBodilessEntity();
	}

	private String armarMensaje(Reporte reporte) {
		return """
				🚨 Nuevo reporte en el morichal
				📍 Dónde: %s
				📝 %s
				🕒 %s""".formatted(
				reporte.getDonde(),
				reporte.getDescripcion(),
				reporte.getFechaCreacion().format(FORMATO_FECHA));
	}
}
