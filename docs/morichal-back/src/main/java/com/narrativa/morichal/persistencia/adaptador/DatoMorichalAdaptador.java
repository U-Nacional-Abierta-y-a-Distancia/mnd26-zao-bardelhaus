package com.narrativa.morichal.persistencia.adaptador;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.narrativa.morichal.dominio.modelo.DatoMorichal;
import com.narrativa.morichal.dominio.gateway.DatoMorichalGateway;
import com.narrativa.morichal.persistencia.entidades.DatoMorichalEntity;
import com.narrativa.morichal.persistencia.repositorio.DatoMorichalRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatoMorichalAdaptador implements DatoMorichalGateway {

	private final DatoMorichalRepository datoMorichalRepository;

	@Override
	public void guardarTodos(List<DatoMorichal> datos) {
		datoMorichalRepository.saveAll(datos.stream()
				.map(dato -> DatoMorichalEntity.builder()
						.tipoMedicion(dato.getTipoMedicion())
						.tipoSensor(dato.getTipoSensor())
						.valor(dato.getValor())
						.fechaCreacion(dato.getFechaCreacion())
						.build())
				.toList());
	}

	@Override
	public List<DatoMorichal> obtenerUltimos(int cantidad) {
		Sort masRecientes = Sort.by(Sort.Direction.DESC, "fechaCreacion", "id");
		return datoMorichalRepository.findAll(PageRequest.of(0, cantidad, masRecientes)).stream()
				.map(entity -> DatoMorichal.builder()
						.tipoMedicion(entity.getTipoMedicion())
						.tipoSensor(entity.getTipoSensor())
						.valor(entity.getValor())
						.fechaCreacion(entity.getFechaCreacion())
						.build())
				.toList();
	}
}
