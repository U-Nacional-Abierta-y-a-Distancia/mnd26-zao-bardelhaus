package com.narrativa.morichal.controlador.dto;

import java.util.Arrays;
import java.util.List;

import com.narrativa.morichal.dominio.modelo.RegistroHogares;
import com.narrativa.morichal.dominio.modelo.enums.Compromiso;

public record RegistroHogaresRespuesta(
		List<HogarRespuesta> hogares,
		TotalesRespuesta totales) {

	public record HogarRespuesta(String referenciaHogar, List<Long> compromisos) {
	}

	public record TotalesRespuesta(long totalCasas, List<TotalCompromisoRespuesta> porCompromiso) {
	}

	public record TotalCompromisoRespuesta(Long id, String descripcion, long total) {
	}

	public static RegistroHogaresRespuesta desdeModelo(RegistroHogares modelo) {
		List<HogarRespuesta> hogares = modelo.getHogares().stream()
				.map(hogar -> new HogarRespuesta(
						hogar.getReferenciaCasa(),
						hogar.getCompromisos().stream().map(Compromiso::getId).toList()))
				.toList();

		List<TotalCompromisoRespuesta> porCompromiso = Arrays.stream(Compromiso.values())
				.map(c -> new TotalCompromisoRespuesta(
						c.getId(),
						c.getDescripcion(),
						modelo.getTotalesPorCompromiso().getOrDefault(c, 0L)))
				.toList();

		return new RegistroHogaresRespuesta(
				hogares,
				new TotalesRespuesta(modelo.getTotalCasas(), porCompromiso));
	}
}
