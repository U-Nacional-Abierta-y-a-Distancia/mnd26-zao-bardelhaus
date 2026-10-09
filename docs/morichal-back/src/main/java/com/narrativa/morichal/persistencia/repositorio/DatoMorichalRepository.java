package com.narrativa.morichal.persistencia.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.narrativa.morichal.persistencia.entidades.DatoMorichalEntity;

public interface DatoMorichalRepository extends JpaRepository<DatoMorichalEntity, Long> {
}
