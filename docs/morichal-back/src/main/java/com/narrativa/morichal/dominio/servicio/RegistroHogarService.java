package com.narrativa.morichal.dominio.servicio;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.narrativa.morichal.dominio.modelo.RegistroHogar;
import com.narrativa.morichal.dominio.modelo.RegistroHogares;
import com.narrativa.morichal.dominio.gateway.RegistroHogarGateway;
import com.narrativa.morichal.dominio.modelo.enums.Compromiso;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistroHogarService {

	private final RegistroHogarGateway registroHogarGateway;

	public void registrar(RegistroHogar registroHogar) {
		registroHogarGateway.guardar(RegistroHogar.builder()
				.referenciaCasa(registroHogar.getReferenciaCasa().trim())
				.compromisos(registroHogar.getCompromisos().stream().distinct().toList())
				.build());
	}

	public RegistroHogares obtenerTodos() {
		List<RegistroHogar> hogares = registroHogarGateway.obtenerTodos();

		Map<Compromiso, Long> totalesPorCompromiso = new EnumMap<>(Compromiso.class);
		Arrays.stream(Compromiso.values()).forEach(c -> totalesPorCompromiso.put(c, 0L));
		hogares.forEach(hogar ->
				hogar.getCompromisos().forEach(c -> totalesPorCompromiso.merge(c, 1L, Long::sum)));

		return RegistroHogares.builder()
				.hogares(hogares)
				.totalCasas(hogares.size())
				.totalesPorCompromiso(totalesPorCompromiso)
				.build();
	}
}
