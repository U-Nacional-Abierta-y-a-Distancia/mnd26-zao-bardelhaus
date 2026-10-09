package com.narrativa.morichal.persistencia.adaptador;

import org.springframework.stereotype.Component;

import com.narrativa.morichal.dominio.modelo.Reporte;
import com.narrativa.morichal.dominio.gateway.ReporteGateway;
import com.narrativa.morichal.persistencia.entidades.ReporteEntity;
import com.narrativa.morichal.persistencia.repositorio.ReporteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReporteAdaptador implements ReporteGateway {

	private final ReporteRepository reporteRepository;

	@Override
	public void guardar(Reporte reporte) {
		reporteRepository.save(ReporteEntity.builder()
				.donde(reporte.getDonde())
				.descripcion(reporte.getDescripcion())
				.fechaCreacion(reporte.getFechaCreacion())
				.evidencia(reporte.getRutaEvidencia())
				.build());
	}
}
