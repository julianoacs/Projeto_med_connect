package com.example.medical_plus.repository;

import com.example.medical_plus.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByEmailUsuario(String emailUsuario);
    List<Agendamento> findByMedicoIgnoreCase(String medico);
}