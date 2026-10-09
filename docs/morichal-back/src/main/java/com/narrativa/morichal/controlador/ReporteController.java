package com.narrativa.morichal.controlador;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.narrativa.morichal.controlador.dto.ReporteDto;
import com.narrativa.morichal.dominio.servicio.ReporteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReporteController {

	private final ReporteService reporteService;

	@PostMapping("/registrar-reporte")
	@ResponseStatus(HttpStatus.CREATED)
	public void registrarReporte(@Valid @RequestBody ReporteDto request) {
		reporteService.registrar(request.aModelo());
	}
}
