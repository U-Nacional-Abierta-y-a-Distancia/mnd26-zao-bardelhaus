package com.narrativa.morichal.dominio.modelo;

import java.math.BigDecimal;

import com.narrativa.morichal.dominio.modelo.enums.TipoSensor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturaSensor {

	private BigDecimal temperatura;
	private BigDecimal humedad;
	private TipoSensor tipoSensor;
}
