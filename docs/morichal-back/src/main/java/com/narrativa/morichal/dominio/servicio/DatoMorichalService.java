package com.narrativa.morichal.dominio.servicio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.narrativa.morichal.dominio.modelo.DatoMorichal;
import com.narrativa.morichal.dominio.modelo.LecturaSensor;
import com.narrativa.morichal.dominio.gateway.DatoMorichalGateway;
import com.narrativa.morichal.dominio.modelo.enums.TipoMedicion;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DatoMorichalService {

	private static final int CANTIDAD_ULTIMOS_REGISTROS = 500;

	private final DatoMorichalGateway datoMorichalGateway;

	public void registrarLectura(LecturaSensor lectura) {
		LocalDateTime fechaCreacion = LocalDateTime.now();

		datoMorichalGateway.guardarTodos(List.of(
				DatoMorichal.builder()
						.tipoMedicion(TipoMedicion.TEMPERATURA)
						.tipoSensor(lectura.getTipoSensor())
						.valor(lectura.getTemperatura())
						.fechaCreacion(fechaCreacion)
						.build(),
				DatoMorichal.builder()
						.tipoMedicion(TipoMedicion.HUMEDAD)
						.tipoSensor(lectura.getTipoSensor())
						.valor(lectura.getHumedad())
						.fechaCreacion(fechaCreacion)
						.build()));
	}

	public List<DatoMorichal> obtenerUltimos() {
		return datoMorichalGateway.obtenerUltimos(CANTIDAD_ULTIMOS_REGISTROS);
	}
}
