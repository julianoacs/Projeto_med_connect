package com.example.medical_plus.service;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class AcessService {

    private final UsuarioRepository usuarioRepository;

    public AcessService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void marcarOnline(Long id) {
        Usuario usuario = usuarioRepository
                .findById(id)
                .orElse(null);

        if (usuario == null) {
            return;
        }

        usuario.setAcesso("ONLINE");
        usuario.setUltimoAcesso(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    public void marcarOffline(Long id) {
        Usuario usuario = usuarioRepository
                .findById(id)
                .orElse(null);

        if (usuario == null) {
            return;
        }

        usuario.setAcesso("OFFLINE");
        usuario.setUltimoAcesso(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    public String calcularAcesso(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return "OFFLINE";
        }

        LocalDateTime ultimoAcesso = usuario.getUltimoAcesso();

        if (ultimoAcesso == null) {
            usuario.setAcesso("OFFLINE");
            usuarioRepository.save(usuario);
            return "OFFLINE";
        }

        long segundosSemAtividade = Duration
                .between(ultimoAcesso, LocalDateTime.now())
                .toSeconds();

        if (segundosSemAtividade >= 60) {
            usuario.setAcesso("OFFLINE");
            usuarioRepository.save(usuario);
            return "OFFLINE";
        }

        usuario.setAcesso("ONLINE");
        usuarioRepository.save(usuario);

        return "ONLINE";
    }
}