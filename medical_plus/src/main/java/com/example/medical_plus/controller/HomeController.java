package com.example.medical_plus.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/landing";
    }

    @GetMapping("/home")
    public String homePage(HttpSession session, Model model) {
        Object usuario = session.getAttribute("usuario");
        model.addAttribute("usuario", usuario);
        return "home";
    }
}