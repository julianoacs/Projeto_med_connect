package com.example.medical_plus.repository;

import com.example.medical_plus.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCase(String email);
    Optional<Usuario> findByEmailAndSenha(String email, String senha);

    List<Usuario> findByTipoIgnoreCase(String tipo);
    List<Usuario> findByTipoIgnoreCaseAndEspecialidadeIgnoreCase(String tipo, String especialidade);

    @Modifying
    @Query("UPDATE Usuario u SET u.ultimoAcesso = :ultimoAcesso WHERE u.id = :id")
    void atualizarUltimoAcesso(
            @Param("id") Long id,
            @Param("ultimoAcesso") LocalDateTime ultimoAcesso
    );
}