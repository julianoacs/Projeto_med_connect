package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.UsuarioRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileControll {

    private final UsuarioRepository usuarioRepository;

    public ProfileControll(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ProfileResponse getProfile(HttpSession session) {
        Usuario usuarioSessao = (Usuario) session.getAttribute("usuario");

        if (usuarioSessao == null) {
            return new ProfileResponse(
                    false,
                    "Usuário não está logado",
                    null
            );
        }

        Usuario usuario = usuarioRepository
                .findById(usuarioSessao.getId())
                .orElse(null);

        if (usuario == null) {
            return new ProfileResponse(
                    false,
                    "Usuário não encontrado",
                    null
            );
        }

        ProfileInfo info = montarProfileInfo(usuario);

        return new ProfileResponse(
                true,
                "Profile carregado com sucesso",
                info
        );
    }

    @PutMapping
    public ProfileResponse updateProfile(
            @RequestBody ProfileUpdateRequest request,
            HttpSession session
    ) {
        Usuario usuarioSessao = (Usuario) session.getAttribute("usuario");

        if (usuarioSessao == null) {
            return new ProfileResponse(
                    false,
                    "Usuário não está logado",
                    null
            );
        }

        Usuario usuario = usuarioRepository
                .findById(usuarioSessao.getId())
                .orElse(null);

        if (usuario == null) {
            return new ProfileResponse(
                    false,
                    "Usuário não encontrado",
                    null
            );
        }

        if (request.nome() != null && !request.nome().isBlank()) {
            usuario.setNome(request.nome());
        }

        if (request.email() != null && !request.email().isBlank()) {
            usuario.setEmail(request.email());
        }

        if (request.phone() != null && !request.phone().isBlank()) {
            usuario.setCelular(request.phone());
        }

        if (request.city() != null && !request.city().isBlank()) {
            usuario.setCity(request.city());
        }

        if (request.dataNascimento() != null && !request.dataNascimento().isBlank()) {
            usuario.setDataNascimento(request.dataNascimento());
        }

        if (!"MEDICO".equalsIgnoreCase(usuario.getTipo())) {
            if (request.cpf() != null && !request.cpf().isBlank()) {
                usuario.setCpf(request.cpf());
            }
        }

        usuarioRepository.save(usuario);

        ProfileInfo info = montarProfileInfo(usuario);

        return new ProfileResponse(
                true,
                "Profile atualizado com sucesso",
                info
        );
    }

    private ProfileInfo montarProfileInfo(Usuario usuario) {
        return new ProfileInfo(
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipo(),
                usuario.getCpf(),
                usuario.getDataNascimento(),
                usuario.getFotoPerfil(),
                usuario.getCelular(),
                usuario.getCity(),
                usuario.getEspecialidade(),
                usuario.getNumeroRegistro()
        );
    }

    public record ProfileResponse(
            boolean success,
            String message,
            ProfileInfo info
    ) {}

    public record ProfileInfo(
            String nome,
            String email,
            String tipo,
            String cpf,
            String dataNascimento,
            String avatar,
            String phone,
            String city,
            String especialidade,
            String numeroRegistro
    ) {}

    public record ProfileUpdateRequest(
            String nome,
            String email,
            String cpf,
            String phone,
            String city,
            String dataNascimento
    ) {}
}