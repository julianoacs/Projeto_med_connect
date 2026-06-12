package com.example.medical_plus.controller;

import com.example.medical_plus.model.Agendamento;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.AgendamentoService;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private UsuarioService usuarioService; // INJEÇÃO DO SERVICE

    // ABRIR TELA DE AGENDAMENTO
    @GetMapping("/agendamentos")
    public String agendamentos(HttpSession session, Model model) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        // BUSCA TODOS EXAMES CADASTRADOS
        List<String> exames = usuarioService.listarTodosExames(); // deve retornar apenas nomes de exames

        // BUSCA APENAS MÉDICOS APROVADOS
        List<Usuario> medicos = usuarioService.listarMedicos().stream()
                .filter(m -> "APROVADO".equalsIgnoreCase(m.getStatus()))
                .toList();

        model.addAttribute("usuario", usuario);
        model.addAttribute("exames", exames);
        model.addAttribute("medicos", medicos);

        return "agendamentos";
    }

    @GetMapping("/medicos-por-exame")
    public String medicosPorExame(String exame, HttpSession session, Model model) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        // Filtrar médicos que realizam o exame
        List<Usuario> medicos = usuarioService.listarMedicosPorExame(exame);

        model.addAttribute("usuario", usuario);
        model.addAttribute("medicos", medicos);
        model.addAttribute("exameSelecionado", exame);

        return "medicos-por-exame";
    }

    // SALVAR AGENDAMENTO
    @PostMapping("/agendar")
    public String agendar(String exame, String medico, String data, String hora,
                          String local, String tipoConsulta, String telefone,
                          HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        Agendamento agendamento = new Agendamento(exame, medico, data, hora, usuario.getEmail(), usuario.getNome());
        agendamento.setLocal(local);
        agendamento.setTipoConsulta(tipoConsulta);
        agendamento.setTelefone(telefone);
        agendamentoService.salvar(agendamento);
        return "redirect:/profile?aba=historico";
    }

    //  CANCELAR AGENDAMENTO
    @GetMapping("/cancelar")
    public String cancelar(int index, HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return "redirect:/login";
        }

        // ADMIN pode cancelar qualquer consulta
        if ("ADMIN".equalsIgnoreCase(usuario.getTipo())) {
            agendamentoService.removerAdmin(index);
        } else {
            agendamentoService.remover(index, usuario.getEmail());
        }

        return "redirect:/profile?aba=historico";
    }

    // ACEITAR CONSULTA
    @GetMapping("/consulta/aceitar")
    public String aceitar(Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        agendamentoService.atualizarStatus(id, "ACEITO");
        return "redirect:/profile?aba=historico";
    }

    // RECUSAR CONSULTA
    @GetMapping("/consulta/recusar")
    public String recusar(Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        agendamentoService.atualizarStatus(id, "RECUSADO");
        return "redirect:/profile?aba=historico";
    }

    // CANCELAR CONSULTA
    @GetMapping("/consulta/cancelar")
    public String cancelarConsulta(Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";
        agendamentoService.atualizarStatus(id, "CANCELADO");
        return "redirect:/profile?aba=historico";
    }
}