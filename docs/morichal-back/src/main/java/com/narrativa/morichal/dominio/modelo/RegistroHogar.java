package com.narrativa.morichal.dominio.modelo;

import java.util.List;

import com.narrativa.morichal.dominio.modelo.enums.Compromiso;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroHogar {

	private String referenciaCasa;
	private List<Compromiso> compromisos;
}
