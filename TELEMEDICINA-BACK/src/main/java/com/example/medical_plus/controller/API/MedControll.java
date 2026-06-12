package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.UsuarioRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MedControll {

    private final UsuarioRepository usuarioRepository;

    public MedControll(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public MedicosResponse getMedicos(
            @RequestParam(required = false) String especialidade,
            HttpSession session
    ) {
        Usuario usuarioSessao = (Usuario) session.getAttribute("usuario");

        if (usuarioSessao == null) {
            return new MedicosResponse(
                    false,
                    "Usuário não está logado",
                    List.of()
            );
        }

        List<Usuario> medicos;

        if (especialidade == null || especialidade.isBlank()) {
            medicos = usuarioRepository.findByTipoIgnoreCase("MEDICO");
        } else {
            medicos = usuarioRepository.findByTipoIgnoreCaseAndEspecialidadeIgnoreCase(
                    "MEDICO",
                    especialidade
            );
        }

        List<MedicoItem> medicosResponse = medicos
                .stream()
                .map(medico -> new MedicoItem(
                        medico.getId(),
                        medico.getNome(),
                        medico.getEmail(),
                        medico.getEspecialidade(),
                        medico.getNumeroRegistro(),
                        medico.getFotoPerfil(),
                        medico.getStatus()
                ))
                .toList();

        return new MedicosResponse(
                true,
                "Médicos carregados com sucesso",
                medicosResponse
        );
    }

    public record MedicosResponse(
            boolean success,
            String message,
            List<MedicoItem> medicos
    ) {}

    public record MedicoItem(
            Long id,
            String nome,
            String email,
            String especialidade,
            String numeroRegistro,
            String avatar,
            String status
    ) {}
}