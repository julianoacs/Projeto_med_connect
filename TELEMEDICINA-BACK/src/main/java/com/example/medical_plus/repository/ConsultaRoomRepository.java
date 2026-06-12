package com.example.medical_plus.repository;

import com.example.medical_plus.model.ConsultaRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultaRoomRepository extends JpaRepository<ConsultaRoom, Long> {

    Optional<ConsultaRoom> findByConsultaId(Long consultaId);

    List<ConsultaRoom> findTop3ByPacienteIdAndMedicoIdNotOrderByCriadoEmDesc(
            Long pacienteId,
            Long medicoId
    );

    List<ConsultaRoom> findTop3ByPacienteIdAndMedicoIdOrderByCriadoEmDesc(
            Long pacienteId,
            Long medicoId
    );

    List<ConsultaRoom> findTop3ByPacienteIdAndConsultaIdNotOrderByCriadoEmDesc(
            Long pacienteId,
            Long consultaId
    );
}