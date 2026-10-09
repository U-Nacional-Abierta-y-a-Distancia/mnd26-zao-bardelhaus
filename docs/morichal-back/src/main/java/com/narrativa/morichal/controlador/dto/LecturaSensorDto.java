package com.narrativa.morichal.controlador.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.narrativa.morichal.dominio.modelo.LecturaSensor;
import com.narrativa.morichal.dominio.modelo.enums.TipoSensor;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record LecturaSensorDto(

		@NotNull(message = "La temperatura es obligatoria")
		@DecimalMin(value = "-20", message = "La temperatura no puede ser menor a -20")
		@DecimalMax(value = "60", message = "La temperatura no puede ser mayor a 60")
		BigDecimal temp,

		@NotNull(message = "La humedad es obligatoria")
		@DecimalMin(value = "0", message = "La humedad no puede ser menor a 0")
		@DecimalMax(value = "100", message = "La humedad no puede ser mayor a 100")
		BigDecimal hum,

		@NotNull(message = "El tipo de sensor es obligatorio")
		@JsonProperty("tipo_sensor")
		TipoSensor tipoSensor) {

	public LecturaSensor aModelo() {
		return LecturaSensor.builder()
				.temperatura(temp)
				.humedad(hum)
				.tipoSensor(tipoSensor)
				.build();
	}
}
