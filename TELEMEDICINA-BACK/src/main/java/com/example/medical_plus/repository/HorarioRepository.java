package com.example.medical_plus.repository;

import com.example.medical_plus.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {

    List<Horario> findByAtivoTrueOrderByHoraAsc();
}








