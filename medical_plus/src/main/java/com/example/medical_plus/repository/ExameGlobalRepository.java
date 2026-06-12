package com.example.medical_plus.repository;

import com.example.medical_plus.model.ExameGlobal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExameGlobalRepository extends JpaRepository<ExameGlobal, Long> {
    Optional<ExameGlobal> findByNomeIgnoreCase(String nome);
    void deleteByNomeIgnoreCase(String nome);
}