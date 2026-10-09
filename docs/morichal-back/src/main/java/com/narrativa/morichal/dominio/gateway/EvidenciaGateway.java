package com.narrativa.morichal.dominio.gateway;

public interface EvidenciaGateway {

	String guardar(byte[] imagen);

	void eliminar(String ruta);
}
