package com.narrativa.morichal.dominio.modelo;

import java.util.List;
import java.util.Map;

import com.narrativa.morichal.dominio.modelo.enums.Compromiso;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroHogares {

	private List<RegistroHogar> hogares;
	private long totalCasas;
	private Map<Compromiso, Long> totalesPorCompromiso;
}
