package com.example.medical_plus.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EspecialidadesController {

    @GetMapping("/especialidades")
    public String especialidades(HttpSession session, Model model) {
        model.addAttribute("usuario", session.getAttribute("usuario"));
        return "especialidades";
    }
}
