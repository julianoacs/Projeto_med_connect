package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.AgendamentoService;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AgendamentoService agendamentoService;

    // VISUALIZAR USUÁRIO (ADMIN)
    @GetMapping("/admin/visualizar-usuario")
    public String visualizarUsuario(@RequestParam String email, @RequestParam String aba,
                                    HttpSession session,
                                    org.springframework.ui.Model model) {
        Usuario admin = (Usuario) session.getAttribute("usuario");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getTipo())) return "redirect:/login";
        Usuario u = usuarioService.buscarPorEmail(email);
        if (u == null) return "redirect:/profile?aba=" + aba;
        model.addAttribute("u", u);
        model.addAttribute("aba", aba);
        return "admin-visualizar";
    }

    // DELETAR CONSULTA (ADMIN)
    @GetMapping("/admin/deletar-consulta")
    public String deletarConsulta(@RequestParam Long id, HttpSession session) {
        Usuario admin = (Usuario) session.getAttribute("usuario");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getTipo())) return "redirect:/login";
        agendamentoService.deletarPorId(id);
        return "redirect:/profile?aba=historico";
    }

    // DELETAR USUÁRIO (ADMIN)
    @GetMapping("/admin/deletar-usuario")
    public String deletarUsuario(@RequestParam String email, @RequestParam String aba, HttpSession session) {
        Usuario admin = (Usuario) session.getAttribute("usuario");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getTipo())) return "redirect:/login";
        usuarioService.removerUsuarioPorEmail(email);
        return "redirect:/profile?aba=" + aba;
    }

    // EDITAR USUÁRIO (ADMIN)
    @PostMapping("/admin/editar-usuario")
    public String editarUsuario(@RequestParam String email, @RequestParam String nome,
                                @RequestParam(required = false) String cpf,
                                @RequestParam(required = false) String dataNascimento,
                                @RequestParam(required = false) String especialidade,
                                @RequestParam String aba, HttpSession session) {
        Usuario admin = (Usuario) session.getAttribute("usuario");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getTipo())) return "redirect:/login";
        usuarioService.editarUsuario(email, nome, cpf, dataNascimento, especialidade);
        return "redirect:/profile?aba=" + aba;
    }

    // ADICIONAR ESPECIALIDADE GLOBAL
    @PostMapping("/admin/adicionar-especialidade-global")
    public String adicionarEspecialidadeGlobal(@RequestParam String especialidade, HttpSession session) {
        Usuario u = (Usuario) session.getAttribute("usuario");
        if (u == null || !"ADMIN".equalsIgnoreCase(u.getTipo())) return "redirect:/login";
        usuarioService.adicionarEspecialidadeGlobal(especialidade);
        return "redirect:/profile?aba=gerenciarEspecialidades";
    }

    // REMOVER ESPECIALIDADE GLOBAL
    @GetMapping("/admin/remover-especialidade-global")
    public String removerEspecialidadeGlobal(@RequestParam String especialidade, HttpSession session) {
        Usuario u = (Usuario) session.getAttribute("usuario");
        if (u == null || !"ADMIN".equalsIgnoreCase(u.getTipo())) return "redirect:/login";
        usuarioService.removerEspecialidadeGlobal(especialidade);
        return "redirect:/profile?aba=gerenciarEspecialidades";
    }

    // ADICIONAR EXAME GLOBAL
    @PostMapping("/admin/adicionar-exame-global")
    public String adicionarExameGlobal(@RequestParam String exame, HttpSession session) {
        Usuario u = (Usuario) session.getAttribute("usuario");
        if (u == null || !"ADMIN".equalsIgnoreCase(u.getTipo())) return "redirect:/login";
        usuarioService.adicionarExameGlobal(exame);
        return "redirect:/profile?aba=gerenciarExames";
    }

    // REMOVER EXAME GLOBAL
    @GetMapping("/admin/remover-exame-global")
    public String removerExameGlobal(@RequestParam String exame, HttpSession session) {
        Usuario u = (Usuario) session.getAttribute("usuario");
        if (u == null || !"ADMIN".equalsIgnoreCase(u.getTipo())) return "redirect:/login";
        usuarioService.removerExameGlobal(exame);
        return "redirect:/profile?aba=gerenciarExames";
    }

    // REMOVER EXAME DO MÉDICO (ADMIN)
    @GetMapping("/admin/remover-exame")
    public String removerExame(String exame, String medico, HttpSession session) {
        Usuario u = (Usuario) session.getAttribute("usuario");
        if (u == null || !"ADMIN".equalsIgnoreCase(u.getTipo())) return "redirect:/login";
        usuarioService.removerExameDoMedico(exame, medico);
        return "redirect:/profile?aba=examesAdmin";
    }

    // APROVAR DOCUMENTO
    @GetMapping("/admin/aprovar-documento")
    public String aprovar(@RequestParam String email, @RequestParam String arquivo) {
        Usuario u = usuarioService.buscarPorEmail(email);
        if (u != null) {
            u.getDocumentos().stream()
                    .filter(d -> d.getNomeArquivo().equals(arquivo))
                    .findFirst()
                    .ifPresent(d -> d.setStatus("APROVADO"));

            boolean todosAprovados = u.getDocumentos().stream()
                    .allMatch(d -> "APROVADO".equals(d.getStatus()));
            if (todosAprovados) u.setStatus("APROVADO");

            usuarioService.salvar(u);
        }
        return "redirect:/profile?aba=medicos";
    }

    // REJEITAR DOCUMENTO
    @GetMapping("/admin/rejeitar-documento")
    public String rejeitar(@RequestParam String email, @RequestParam String arquivo) {
        Usuario u = usuarioService.buscarPorEmail(email);
        if (u != null) {
            u.getDocumentos().stream()
                    .filter(d -> d.getNomeArquivo().equals(arquivo))
                    .findFirst()
                    .ifPresent(d -> d.setStatus("REJEITADO"));

            boolean algumRejeitado = u.getDocumentos().stream()
                    .anyMatch(d -> "REJEITADO".equals(d.getStatus()));
            if (algumRejeitado) u.setStatus("PENDENTE");

            usuarioService.salvar(u);
        }
        return "redirect:/profile?aba=medicos";
    }
}