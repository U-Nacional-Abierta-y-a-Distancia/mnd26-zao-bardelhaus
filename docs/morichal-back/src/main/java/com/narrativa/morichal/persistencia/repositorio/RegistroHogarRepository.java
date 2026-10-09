package com.narrativa.morichal.persistencia.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.narrativa.morichal.persistencia.entidades.RegistroHogarEntity;

public interface RegistroHogarRepository extends JpaRepository<RegistroHogarEntity, Long> {
}
