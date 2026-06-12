package com.example.medical_plus.controller;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
public class MedicoController {

    @Autowired
    private UsuarioService usuarioService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // ADICIONAR EXAME
    @PostMapping("/medico/adicionar-exame")
    public String adicionarExame(String exame, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuarioService.adicionarExameAoMedico(usuario, exame);
        return "redirect:/profile?aba=exames";
    }

    // REMOVER EXAME
    @GetMapping("/medico/remover-exame")
    public String removerExame(String exame, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuario.getExames().removeIf(e -> e.equalsIgnoreCase(exame));
        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=exames";
    }

    // UPLOAD DE DOCUMENTOS
    @PostMapping("/medico/upload-documento")
    public String uploadDocumentos(@RequestParam("arquivos") MultipartFile[] arquivos,
                                   HttpSession session) throws IOException {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        // Garante que a pasta existe
        Path pastaUpload = Paths.get(uploadDir).toAbsolutePath();
        if (!Files.exists(pastaUpload)) {
            Files.createDirectories(pastaUpload);
        }

        for (MultipartFile arquivo : arquivos) {
            if (!arquivo.isEmpty()) {
                String nomeOriginal = arquivo.getOriginalFilename();
                String nomeUnico = UUID.randomUUID() + "_" + nomeOriginal;

                Path destino = pastaUpload.resolve(nomeUnico);
                Files.write(destino, arquivo.getBytes());

                usuario.adicionarDocumento(nomeUnico);
            }
        }

        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=documentos";
    }

    // REMOVER DOCUMENTO
    @GetMapping("/medico/remover-documento")
    public String removerDocumento(String nome, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        usuario.removerDocumento(nome);
        usuarioService.salvar(usuario);
        try {
            Files.deleteIfExists(Paths.get(uploadDir).toAbsolutePath().resolve(nome));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "redirect:/profile?aba=documentos";
    }

    // DEFINIR ESPECIALIDADE
    @PostMapping("/medico/definir-especialidade")
    public String definirEspecialidade(String especialidade, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuario.setEspecialidade(especialidade);
        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=dados";
    }

    // DEFINIR REGISTRO PROFISSIONAL
    @PostMapping("/medico/definir-registro")
    public String definirRegistro(String tipoRegistro, String numeroRegistro, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return "redirect:/login";
        usuario.setTipoRegistro(tipoRegistro);
        usuario.setNumeroRegistro(numeroRegistro);
        usuarioService.salvar(usuario);
        return "redirect:/profile?aba=especialidade";
    }
}