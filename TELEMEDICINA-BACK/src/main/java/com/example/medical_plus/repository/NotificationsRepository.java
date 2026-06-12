package com.example.medical_plus.repository;

import com.example.medical_plus.model.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {

    boolean existsByUsuarioIdAndLidaFalse(Long usuarioId);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);

    List<Notifications> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    List<Notifications> findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(Long usuarioId);
}