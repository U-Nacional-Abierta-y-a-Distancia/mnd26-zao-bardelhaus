package com.narrativa.morichal.persistencia.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.narrativa.morichal.persistencia.entidades.ReporteEntity;

public interface ReporteRepository extends JpaRepository<ReporteEntity, Long> {
}
