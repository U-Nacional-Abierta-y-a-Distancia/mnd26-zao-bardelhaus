package com.narrativa.morichal.dominio.modelo.enums;

import java.util.Arrays;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Compromiso {

	NO_QUEMAR_BASURA(1L, "No quemar basura"),
	NO_BOTAR_BASURA_CERCA_MORICHAL(2L, "No botar nada al morichal ni a su orilla"),
	SEPARAR_BASURA_CASA(3L, "Separar la basura de casa"),
    HACER_COMPOST(4L, "Hacer compost con los residuos orgánicos"),
	PARTICIPAR_JORNADA_LIMPIEZA(5L, "Participar en la jornada de limpieza"),
	RECICLAJE_PUNTO_ACOPIO(6L, "Llevar reciclables al punto de acopio");

	private final Long id;
	private final String descripcion;

	public static Compromiso fromId(Long id) {
		return Arrays.stream(values())
				.filter(c -> c.id.equals(id))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Compromiso no válido: " + id));
	}
}
