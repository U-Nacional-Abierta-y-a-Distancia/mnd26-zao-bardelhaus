package com.narrativa.morichal.dominio.modelo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {

	private String donde;
	private String descripcion;
	private byte[] evidencia;
	private String rutaEvidencia;
	private LocalDateTime fechaCreacion;
}
