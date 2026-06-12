package com.example.medical_plus.repository;

import com.example.medical_plus.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findByPacienteIdOrderByDataAscHoraAsc(Long pacienteId);

    List<Consulta> findByPacienteIdOrderByDataDescHoraDesc(Long pacienteId);

    List<Consulta> findByMedicoIdOrderByDataAscHoraAsc(Long medicoId);

    boolean existsByMedicoIdAndDataAndHora(Long medicoId, String data, String hora);
}