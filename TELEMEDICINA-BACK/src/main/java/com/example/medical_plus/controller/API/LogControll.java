package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;
import com.example.medical_plus.service.AcessService;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LogControll {

    private final UsuarioService usuarioService;
    private final AcessService acessService;

    public LogControll(
            UsuarioService usuarioService,
            AcessService acessService
    ) {
        this.usuarioService = usuarioService;
        this.acessService = acessService;
    }

    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request, HttpSession session) {
        Usuario usuario = usuarioService.autenticar(request.email(), request.senha());

        if (usuario == null) {
            return new LoginResponse(false, "Email ou senha inválidos", null);
        }

        session.setAttribute("usuario", usuario);

        try {
            acessService.marcarOnline(usuario.getId());
        } catch (Exception erro) {
            System.out.println("Erro ao marcar ONLINE: " + erro.getMessage());
        }

        return new LoginResponse(true, "Login realizado com sucesso", usuario);
    }

    @PostMapping("/activity")
    public ActivityResponse activity(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new ActivityResponse(false, "OFFLINE");
        }

        try {
            acessService.marcarOnline(usuario.getId());
            return new ActivityResponse(true, "ONLINE");
        } catch (Exception error) {
            System.out.println("Erro ao atualizar atividade do usuário: " + error.getMessage());
            return new ActivityResponse(false, "OFFLINE");
        }
    }

    @GetMapping("/status")
    public ActivityResponse status(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new ActivityResponse(false, "OFFLINE");
        }

        try {
            String accessState = acessService.calcularAcesso(usuario.getId());
            return new ActivityResponse(true, accessState);
        } catch (Exception error) {
            System.out.println("Erro ao calcular acesso do usuário: " + error.getMessage());
            return new ActivityResponse(false, "OFFLINE");
        }
    }

    @GetMapping("/session")
    public Object session(HttpSession session) {
        Object usuario = session.getAttribute("usuario");

        if (usuario == null) {
            return new LoginResponse(false, "Nenhum usuário logado", null);
        }

        return new LoginResponse(true, "Usuário logado", usuario);
    }

    @PostMapping("/logout")
    public Object logout(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario != null) {
            try {
                acessService.marcarOffline(usuario.getId());
            } catch (Exception error) {
                System.out.println("Erro ao marcar usuário como OFFLINE: " + error.getMessage());
            }
        }

        session.invalidate();

        return new LogoutResponse(true, "Logout realizado com sucesso");
    }

    public record LoginRequest(String email, String senha) {}

    public record LoginResponse(
            boolean success,
            String message,
            Object usuario
    ) {}

    public record ActivityResponse(
            boolean success,
            String state
    ) {}

    public record LogoutResponse(
            boolean success,
            String message
    ) {}
}