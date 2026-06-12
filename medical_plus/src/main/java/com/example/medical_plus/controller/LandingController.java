package com.example.medical_plus.controller;

import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LandingController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/landing")
    public String landing(HttpSession session, Model model) {
        model.addAttribute("usuario", session.getAttribute("usuario"));
        model.addAttribute("medicos", usuarioService.listarMedicos().stream()
                .filter(m -> "APROVADO".equalsIgnoreCase(m.getStatus()))
                .toList());
        return "landing";
    }
}
