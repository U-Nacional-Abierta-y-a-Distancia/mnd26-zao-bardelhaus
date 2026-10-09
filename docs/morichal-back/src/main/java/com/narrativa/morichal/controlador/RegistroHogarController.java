package com.narrativa.morichal.controlador;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.narrativa.morichal.controlador.dto.RegistroHogarRequest;
import com.narrativa.morichal.controlador.dto.RegistroHogaresRespuesta;
import com.narrativa.morichal.dominio.servicio.RegistroHogarService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RegistroHogarController {

	private final RegistroHogarService registroHogarService;

	@PostMapping("/registrar-hogar")
	@ResponseStatus(HttpStatus.CREATED)
	public void registrarHogar(@Valid @RequestBody RegistroHogarRequest request) {
		registroHogarService.registrar(request.aModelo());
	}

	@GetMapping("/registros-hogar")
	public RegistroHogaresRespuesta obtenerRegistrosHogar() {
		return RegistroHogaresRespuesta.desdeModelo(registroHogarService.obtenerTodos());
	}
}
