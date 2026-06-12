package com.example.medical_plus.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SobreController {

    @GetMapping("/sobre")
    public String sobre(HttpSession session, Model model) {
        model.addAttribute("usuario", session.getAttribute("usuario"));
        return "sobre";
    }
}
