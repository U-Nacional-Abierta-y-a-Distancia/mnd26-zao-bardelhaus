package com.narrativa.morichal.persistencia.adaptador;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.narrativa.morichal.dominio.modelo.RegistroHogar;
import com.narrativa.morichal.dominio.gateway.RegistroHogarGateway;
import com.narrativa.morichal.dominio.modelo.enums.Compromiso;
import com.narrativa.morichal.persistencia.entidades.RegistroHogarEntity;
import com.narrativa.morichal.persistencia.repositorio.RegistroHogarRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RegistroHogarAdaptador implements RegistroHogarGateway {

	private final RegistroHogarRepository registroHogarRepository;


	@Override
	public void guardar(RegistroHogar registroHogar) {
		List<RegistroHogarEntity> entities = registroHogar.getCompromisos().stream()
				.map(compromiso -> RegistroHogarEntity.builder()
						.referenciaCasa(registroHogar.getReferenciaCasa())
						.compromiso(compromiso.getId().shortValue())
						.build())
				.toList();

		registroHogarRepository.saveAll(entities);
	}


	@Override
	public List<RegistroHogar> obtenerTodos() {
		Map<String, Set<Compromiso>> compromisosPorCasa = new LinkedHashMap<>();
		for (RegistroHogarEntity entity : registroHogarRepository.findAll(Sort.by("id"))) {
			compromisosPorCasa
					.computeIfAbsent(entity.getReferenciaCasa(), k -> new LinkedHashSet<>())
					.add(Compromiso.fromId(entity.getCompromiso().longValue()));
		}

		return compromisosPorCasa.entrySet().stream()
				.map(e -> RegistroHogar.builder()
						.referenciaCasa(e.getKey())
						.compromisos(List.copyOf(e.getValue()))
						.build())
				.toList();
	}
}
