package com.narrativa.morichal.controlador;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.narrativa.morichal.controlador.dto.DatoMorichalRespuesta;
import com.narrativa.morichal.dominio.servicio.DatoMorichalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DatoMorichalController {

	private final DatoMorichalService datoMorichalService;

	@GetMapping("/datos-morichal")
	public List<DatoMorichalRespuesta> obtenerUltimosDatos() {
		return datoMorichalService.obtenerUltimos().stream()
				.map(DatoMorichalRespuesta::desdeModelo)
				.toList();
	}
}
