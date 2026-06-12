package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CadastroController {

    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping("/cadastro")
    public String mostrarTelaCadastro() {
        return "cadastro";
    }

    @PostMapping("/cadastrar")
    public String cadastrar(String nome, String email, String senha, String tipo,
                            String cpf, String dataNascimento) {
        Usuario usuario = new Usuario(nome, email, senha, tipo, cpf, dataNascimento);
        usuarioService.salvar(usuario);
        return "redirect:/login";
    }
}