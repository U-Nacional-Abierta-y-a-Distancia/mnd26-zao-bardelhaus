package com.narrativa.morichal.controlador.dto;

import com.narrativa.morichal.dominio.modelo.Reporte;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReporteDto(

		@NotNull(message = "El lugar del reporte es obligatorio")
		@NotBlank(message = "El lugar del reporte no puede estar vacío")
		@Size(max = 255, message = "El lugar del reporte no puede superar 255 caracteres")
		String donde,

		@NotNull(message = "La descripción es obligatoria")
		@NotBlank(message = "La descripción no puede estar vacía")
		@Size(max = 2000, message = "La descripción no puede superar 2000 caracteres")
		String descripcion,

		@Size(max = 5 * 1024 * 1024, message = "La evidencia no puede superar 5 MB")
		byte[] evidencia) {

	public Reporte aModelo() {
		return Reporte.builder()
				.donde(donde)
				.descripcion(descripcion)
				.evidencia(evidencia)
				.build();
	}
}
