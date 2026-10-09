package com.narrativa.morichal.controlador.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.narrativa.morichal.dominio.modelo.DatoMorichal;
import com.narrativa.morichal.dominio.modelo.enums.TipoMedicion;
import com.narrativa.morichal.dominio.modelo.enums.TipoSensor;

public record DatoMorichalRespuesta(
		TipoMedicion tipoMedicion,
		TipoSensor tipoSensor,
		BigDecimal valor,
		LocalDateTime fechaCreacion) {

	public static DatoMorichalRespuesta desdeModelo(DatoMorichal modelo) {
		return new DatoMorichalRespuesta(
				modelo.getTipoMedicion(),
				modelo.getTipoSensor(),
				modelo.getValor(),
				modelo.getFechaCreacion());
	}
}
