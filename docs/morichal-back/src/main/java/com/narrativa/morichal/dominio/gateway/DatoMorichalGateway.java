package com.narrativa.morichal.dominio.gateway;

import java.util.List;

import com.narrativa.morichal.dominio.modelo.DatoMorichal;

public interface DatoMorichalGateway {

	void guardarTodos(List<DatoMorichal> datos);

	List<DatoMorichal> obtenerUltimos(int cantidad);
}
