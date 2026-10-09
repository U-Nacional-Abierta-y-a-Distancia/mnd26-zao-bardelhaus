package com.narrativa.morichal.dominio.modelo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.narrativa.morichal.dominio.modelo.enums.TipoMedicion;
import com.narrativa.morichal.dominio.modelo.enums.TipoSensor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatoMorichal {

	private TipoMedicion tipoMedicion;
	private TipoSensor tipoSensor;
	private BigDecimal valor;
	private LocalDateTime fechaCreacion;
}
