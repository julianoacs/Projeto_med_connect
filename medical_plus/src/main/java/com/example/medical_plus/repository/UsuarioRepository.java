package com.example.medical_plus.repository;

import com.example.medical_plus.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCase(String email);
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
    List<Usuario> findByTipoIgnoreCase(String tipo);
}