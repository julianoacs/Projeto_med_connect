package com.example.medical_plus.repository;

import com.example.medical_plus.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamsRepository extends JpaRepository<Exams, Long> {

    List<Exams> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByNomeAsc(String nome);

    List<Exams> findByAtivoTrueOrderByNomeAsc();

    List<Exams> findByPacienteIdOrderByCriadoEmDesc(Long pacienteId);

    List<Exams> findByMedicoIdOrderByCriadoEmDesc(Long medicoId);

    List<Exams> findByConsultaIdOrderByCriadoEmDesc(Long consultaId);

    List<Exams> findByPacienteIdAndConsultaIdOrderByCriadoEmDesc(Long pacienteId, Long consultaId);
}