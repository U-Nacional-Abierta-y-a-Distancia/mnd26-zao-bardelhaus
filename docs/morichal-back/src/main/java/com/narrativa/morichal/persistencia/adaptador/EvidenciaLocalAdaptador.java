package com.narrativa.morichal.persistencia.adaptador;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.narrativa.morichal.dominio.gateway.EvidenciaGateway;

@Component
public class EvidenciaLocalAdaptador implements EvidenciaGateway {

	private final Path directorio;

	public EvidenciaLocalAdaptador(@Value("${morichal.evidencias.directorio}") String directorio) {
		this.directorio = Path.of(directorio).toAbsolutePath().normalize();
	}

	@Override
	public String guardar(byte[] imagen) {
		Path destino = directorio.resolve(UUID.randomUUID() + "." + extension(imagen));
		try {
			Files.createDirectories(directorio);
			Files.write(destino, imagen);
		} catch (IOException ex) {
			throw new UncheckedIOException("No se pudo guardar la evidencia", ex);
		}
		return destino.toString();
	}

	@Override
	public void eliminar(String ruta) {
		try {
			Files.deleteIfExists(Path.of(ruta));
		} catch (IOException ex) {
			throw new UncheckedIOException("No se pudo eliminar la evidencia " + ruta, ex);
		}
	}

	private String extension(byte[] imagen) {
		if (empiezaCon(imagen, 0xFF, 0xD8, 0xFF)) {
			return "jpg";
		}
		if (empiezaCon(imagen, 0x89, 0x50, 0x4E, 0x47)) {
			return "png";
		}
		if (empiezaCon(imagen, 0x47, 0x49, 0x46, 0x38)) {
			return "gif";
		}
		if (imagen.length >= 12
				&& empiezaCon(imagen, 0x52, 0x49, 0x46, 0x46)
				&& imagen[8] == 'W' && imagen[9] == 'E' && imagen[10] == 'B' && imagen[11] == 'P') {
			return "webp";
		}
		throw new IllegalArgumentException("La evidencia debe ser una imagen JPG, PNG, GIF o WEBP");
	}

	private boolean empiezaCon(byte[] datos, int... firma) {
		if (datos.length < firma.length) {
			return false;
		}
		for (int i = 0; i < firma.length; i++) {
			if ((datos[i] & 0xFF) != firma[i]) {
				return false;
			}
		}
		return true;
	}
}
