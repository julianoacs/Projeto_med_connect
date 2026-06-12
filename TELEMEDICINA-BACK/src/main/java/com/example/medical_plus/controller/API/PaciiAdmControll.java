package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.UsuarioRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pacientes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaciiAdmControll {

    private final UsuarioRepository usuarioRepository;

    public PaciiAdmControll(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public PacientesAdmResponse listarPacientes(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new PacientesAdmResponse(
                    false,
                    "Usuário não está logado",
                    List.of()
            );
        }

        if (!"ADMIN".equalsIgnoreCase(usuario.getTipo())) {
            return new PacientesAdmResponse(
                    false,
                    "Usuário não é administrador",
                    List.of()
            );
        }

        List<PacienteAdmItem> pacientes = usuarioRepository
                .findByTipoIgnoreCase("PACIENTE")
                .stream()
                .map(paciente -> new PacienteAdmItem(
                        paciente.getId(),
                        paciente.getNome(),
                        paciente.getEmail(),
                        paciente.getFotoPerfil(),
                        paciente.getPlano(),
                        paciente.getStatus(),
                        paciente.getAcesso()
                ))
                .toList();

        return new PacientesAdmResponse(
                true,
                "Pacientes carregados com sucesso",
                pacientes
        );
    }

    public record PacientesAdmResponse(
            boolean success,
            String message,
            List<PacienteAdmItem> pacientes
    ) {}

    public record PacienteAdmItem(
            Long id,
            String nome,
            String email,
            String avatar,
            String plano,
            String status,
            String acesso
    ) {}
}