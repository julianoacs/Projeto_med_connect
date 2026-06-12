package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.AgendamentoService;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProfileController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/profile")
    public String profile(HttpSession session, Model model) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        // PROTEÇÃO
        if (usuario == null) {
            return "redirect:/login";
        }

        // USUÁRIO LOGADO
        model.addAttribute("usuario", usuario);

        // ADMIN
        if ("ADMIN".equalsIgnoreCase(usuario.getTipo())) {

            // ADMIN
            model.addAttribute("agendamentos",
                    agendamentoService.listarTodos());

            model.addAttribute("pacientes",
                    usuarioService.listarPacientes());

            model.addAttribute("medicos",
                    usuarioService.listarMedicos());

            model.addAttribute("todosExames",
                    usuarioService.listarTodosExamesComMedico());

            model.addAttribute("examesGlobais",
                    usuarioService.listarExamesDisponiveis());

            model.addAttribute("especialidadesGlobais",
                    usuarioService.listarEspecialidades());

        }
        else if ("MEDICO".equalsIgnoreCase(usuario.getTipo())) {

            // MÉDICO
            model.addAttribute("agendamentos",
                    agendamentoService.listarPorMedico(usuario.getNome()));

            model.addAttribute("examesDisponiveis",
                    usuarioService.listarExamesDisponiveis());

            model.addAttribute("especialidadesDisponiveis",
                    usuarioService.listarEspecialidades());

            model.addAttribute("locaisAtendimento",
                    usuario.getLocaisAtendimento());

        }
        else {

            // PACIENTE
            model.addAttribute("agendamentos",
                    agendamentoService.listarPorUsuario(usuario.getEmail()));
        }

        return "profile";
    }

    @PostMapping("/profile/editar")
    public String editar(HttpSession session,
                         @RequestParam String nome,
                         @RequestParam String email,
                         @RequestParam String cpf,
                         @RequestParam String dataNascimento,
                         @RequestParam(required = false) String senha) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setCpf(cpf);
        usuario.setDataNascimento(dataNascimento);
        if (senha != null && !senha.trim().isEmpty()) {
            usuario.setSenha(senha);
        }

        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=dados";
    }
}