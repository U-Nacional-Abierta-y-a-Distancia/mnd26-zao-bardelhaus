package com.narrativa.morichal.controlador.dto;

import java.util.List;

import com.narrativa.morichal.controlador.constantes.ConstantesPatrones;
import com.narrativa.morichal.dominio.modelo.RegistroHogar;
import com.narrativa.morichal.dominio.modelo.enums.Compromiso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RegistroHogarRequest(

		@NotNull(message = "La referencia de la casa es obligatoria")
		@NotBlank(message = "La referencia de la casa no puede estar vacía")
		@Pattern(regexp = ConstantesPatrones.DIRECCION,
				message = "La referencia de la casa " + ConstantesPatrones.DIRECCION_MENSAJE)
		String referenciaCasa,

		@NotNull(message = "Los compromisos son obligatorios")
		@NotEmpty(message = "Debe indicar al menos un compromiso")
		List<@NotNull(message = "El compromiso no puede ser nulo") Long> compromiso) {

	public RegistroHogar aModelo() {
		List<Compromiso> compromisos = compromiso == null
				? List.of()
				: compromiso.stream().map(Compromiso::fromId).toList();

		return RegistroHogar.builder()
				.referenciaCasa(referenciaCasa)
				.compromisos(compromisos)
				.build();
	}
}
