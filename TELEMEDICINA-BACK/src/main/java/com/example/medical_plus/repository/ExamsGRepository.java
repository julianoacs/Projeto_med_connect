package com.example.medical_plus.repository;

import com.example.medical_plus.model.ExamsG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamsGRepository extends JpaRepository<ExamsG, Long> {

    Optional<ExamsG> findByNomeIgnoreCase(String nome);

    List<ExamsG> findByAtivoTrueOrderByNomeAsc();

    @Query("""
        SELECT e FROM ExamsG e
        WHERE e.ativo = true
        AND (
            LOWER(e.nome) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.categoria) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY e.nome ASC
    """)
    List<ExamsG> buscarPorTexto(@Param("search") String search);
}