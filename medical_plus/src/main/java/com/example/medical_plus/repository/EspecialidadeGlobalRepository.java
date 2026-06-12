package com.example.medical_plus.repository;

import com.example.medical_plus.model.EspecialidadeGlobal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EspecialidadeGlobalRepository extends JpaRepository<EspecialidadeGlobal, Long> {
    Optional<EspecialidadeGlobal> findByNomeIgnoreCase(String nome);
    void deleteByNomeIgnoreCase(String nome);
}