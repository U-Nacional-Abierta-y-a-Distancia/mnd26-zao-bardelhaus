package com.narrativa.morichal.dominio.servicio;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.narrativa.morichal.dominio.modelo.Reporte;
import com.narrativa.morichal.dominio.gateway.EvidenciaGateway;
import com.narrativa.morichal.dominio.gateway.PublicacionComunidadGateway;
import com.narrativa.morichal.dominio.gateway.ReporteGateway;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReporteService {

	private final ReporteGateway reporteGateway;
	private final EvidenciaGateway evidenciaGateway;
	private final PublicacionComunidadGateway publicacionComunidadGateway;

	public void registrar(Reporte reporte) {
		boolean tieneEvidencia = reporte.getEvidencia() != null && reporte.getEvidencia().length > 0;
		String rutaEvidencia = tieneEvidencia ? evidenciaGateway.guardar(reporte.getEvidencia()) : null;

		Reporte reporteGuardado = reporte.toBuilder()
				.donde(reporte.getDonde().trim())
				.descripcion(reporte.getDescripcion().trim())
				.rutaEvidencia(rutaEvidencia)
				.fechaCreacion(LocalDateTime.now())
				.build();

		try {
			reporteGateway.guardar(reporteGuardado);
		} catch (RuntimeException ex) {
			if (rutaEvidencia != null) {
				evidenciaGateway.eliminar(rutaEvidencia);
			}
			throw ex;
		}

		try {
			publicacionComunidadGateway.publicarReporte(reporteGuardado);
		} catch (RuntimeException ex) {
			log.error("No se pudo publicar el reporte en el grupo de la comunidad", ex);
		}
	}
}
