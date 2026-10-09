package com.narrativa.morichal.persistencia.entidades;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.narrativa.morichal.dominio.modelo.enums.TipoMedicion;
import com.narrativa.morichal.dominio.modelo.enums.TipoSensor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "datos_morichal")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatoMorichalEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "tipo_medicion", nullable = false, length = 20)
	private TipoMedicion tipoMedicion;

	@Enumerated(EnumType.STRING)
	@Column(name = "tipo_sensor", nullable = false, length = 20)
	private TipoSensor tipoSensor;

	@Column(name = "valor", nullable = false, precision = 10, scale = 2)
	private BigDecimal valor;

	@Column(name = "fecha_creacion", nullable = false)
	private LocalDateTime fechaCreacion;
}
