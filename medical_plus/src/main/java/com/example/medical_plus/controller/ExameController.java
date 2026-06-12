package com.example.medical_plus.controller;

import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExameController {

    @Autowired
    private UsuarioService usuarioService;

    // TELA DE EXAMES COM EXPANSÃO DE MÉDICOS
    @GetMapping("/exames")
    public String listarExames(Model model, HttpSession session) {

        // EXAMES (vindos dos médicos)
        model.addAttribute("exames", usuarioService.listarTodosExames());

        // MÉDICOS (necessário para expandir na tela)
        model.addAttribute("medicos", usuarioService.listarMedicos());

        // USUÁRIO LOGADO (header)
        model.addAttribute("usuario", session.getAttribute("usuario"));

        return "exames";
    }
}