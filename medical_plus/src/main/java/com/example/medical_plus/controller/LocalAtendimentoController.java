package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LocalAtendimentoController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/medico/adicionar-local")
    public String adicionar(@RequestParam String nome,
                            @RequestParam String endereco,
                            HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuario.adicionarLocal(nome, endereco);
        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=local";
    }

    @GetMapping("/medico/remover-local")
    public String remover(@RequestParam Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuario.removerLocal(id);
        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=local";
    }
}