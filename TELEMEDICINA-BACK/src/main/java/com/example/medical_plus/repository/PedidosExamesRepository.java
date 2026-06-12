package com.example.medical_plus.repository;

import com.example.medical_plus.model.PedidosExames;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidosExamesRepository extends JpaRepository<PedidosExames, Long> {

    List<PedidosExames> findByConsultaIdOrderByDataSolicitacaoDesc(Long consultaId);
}