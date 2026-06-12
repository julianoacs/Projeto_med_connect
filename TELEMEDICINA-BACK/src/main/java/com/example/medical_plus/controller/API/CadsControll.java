package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cadastro")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CadsControll {

    private final UsuarioService usuarioService;

    public CadsControll(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public CadastroResponse cadastrar(@RequestBody CadastroRequest request) {
        try {
            validarBase(request);

            String tipo = request.tipo().trim().toUpperCase();

            Usuario usuario = new Usuario();

            usuario.setNome(request.nome().trim());
            usuario.setEmail(request.email().trim());
            usuario.setSenha(request.senha());
            usuario.setTipo(tipo);

            usuario.setCpf(limpar(request.cpf()));
            usuario.setCelular(limpar(request.celular()));

            if (!isBlank(request.plano())) {
                usuario.setPlano(limpar(request.plano()));
            }

            if ("PACIENTE".equals(tipo)) {
                validarPaciente(request);

                usuario.setDataNascimento(limpar(request.dataNascimento()));
                usuario.setStatus("VALIDADO");
            }

            if ("MEDICO".equals(tipo)) {
                validarMedico(request);

                usuario.setTipoRegistro("CRM");
                usuario.setNumeroRegistro(limpar(request.crm()));
                usuario.setEspecialidade(limpar(request.especialidade()));
                usuario.setStatus("PENDENTE");
            }

            Usuario salvo = usuarioService.cadastrarUsuario(usuario);

            return new CadastroResponse(
                    true,
                    "Cadastro realizado com sucesso",
                    salvo.getId(),
                    salvo.getTipo(),
                    salvo.getStatus()
            );

        } catch (IllegalArgumentException erro) {
            return new CadastroResponse(
                    false,
                    erro.getMessage(),
                    null,
                    null,
                    null
            );
        }
    }

    private void validarBase(CadastroRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados do cadastro não enviados");
        }

        if (isBlank(request.nome())) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }

        if (isBlank(request.email())) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }

        if (isBlank(request.senha())) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        if (!isBlank(request.confirmarSenha()) && !request.senha().equals(request.confirmarSenha())) {
            throw new IllegalArgumentException("As senhas não conferem");
        }

        if (isBlank(request.tipo())) {
            throw new IllegalArgumentException("Tipo de usuário é obrigatório");
        }

        if (isBlank(request.cpf())) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }

        if (isBlank(request.celular())) {
            throw new IllegalArgumentException("Celular é obrigatório");
        }

        String tipo = request.tipo().trim().toUpperCase();

        if (!"PACIENTE".equals(tipo) && !"MEDICO".equals(tipo)) {
            throw new IllegalArgumentException("Tipo de usuário inválido");
        }
    }

    private void validarPaciente(CadastroRequest request) {
        if (isBlank(request.dataNascimento())) {
            throw new IllegalArgumentException("Data de nascimento é obrigatória para paciente");
        }
    }

    private void validarMedico(CadastroRequest request) {
        if (isBlank(request.crm())) {
            throw new IllegalArgumentException("CRM é obrigatório para médico");
        }

        if (isBlank(request.especialidade())) {
            throw new IllegalArgumentException("Especialidade é obrigatória para médico");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String limpar(String value) {
        return value == null ? null : value.trim();
    }

    public record CadastroRequest(
            String nome,
            String email,
            String senha,
            String confirmarSenha,
            String tipo,

            String cpf,
            String celular,
            String plano,

            String dataNascimento,

            String crm,
            String especialidade,
            String universidade
    ) {}

    public record CadastroResponse(
            boolean success,
            String message,
            Long usuarioId,
            String tipo,
            String status
    ) {}
}