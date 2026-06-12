package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class MedicosController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/medicos")
    public String listarMedicos(Model model, HttpSession session) {

        // BUSCA APENAS MÉDICOS APROVADOS
        List<Usuario> medicos = usuarioService.listarMedicos().stream()
                .filter(m -> "APROVADO".equalsIgnoreCase(m.getStatus()))
                .toList();

        // Envia médicos para o HTML
        model.addAttribute("medicos", medicos);

        // Envia usuário logado (IMPORTANTE)
        model.addAttribute("usuario", session.getAttribute("usuario"));

        return "medicos";
    }
}