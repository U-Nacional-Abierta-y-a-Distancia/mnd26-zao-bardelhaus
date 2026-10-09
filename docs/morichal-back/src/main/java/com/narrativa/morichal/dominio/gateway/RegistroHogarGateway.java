package com.narrativa.morichal.dominio.gateway;

import java.util.List;

import com.narrativa.morichal.dominio.modelo.RegistroHogar;

public interface RegistroHogarGateway {

	void guardar(RegistroHogar registroHogar);

	List<RegistroHogar> obtenerTodos();
}
