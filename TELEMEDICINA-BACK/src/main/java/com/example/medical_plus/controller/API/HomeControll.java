package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.UsuarioRepository;
import com.example.medical_plus.service.UsuarioService;
import com.example.medical_plus.service.NotificationsService;

import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class HomeControll {

        private final NotificationsService notificationsService;
        private final UsuarioService usuarioService;
        private final UsuarioRepository usuarioRepository;

        public HomeControll(
                NotificationsService notificationsService,
                UsuarioService usuarioService,
                UsuarioRepository usuarioRepository
        ) {
                this.notificationsService = notificationsService;
                this.usuarioService = usuarioService;
                this.usuarioRepository = usuarioRepository;
        }

        @GetMapping
        public HomeResponse getHome(HttpSession session) {
        Usuario usuarioSessao = (Usuario) session.getAttribute("usuario");

        if (usuarioSessao == null) {
                return new HomeResponse(
                        false,
                        "Usuário não está logado",
                        null,
                        null,
                        null,
                        null
                );
        }

        Usuario usuario = usuarioRepository
                .findById(usuarioSessao.getId())
                .orElse(null);

        if (usuario == null) {
                return new HomeResponse(
                        false,
                        "Usuário não encontrado",
                        null,
                        null,
                        null,
                        null
                );
        }

        System.out.println("=== HOME DEBUG ===");
        System.out.println("ID SESSAO: " + usuarioSessao.getId());
        System.out.println("CPF SESSAO: " + usuarioSessao.getCpf());
        System.out.println("ID BANCO: " + usuario.getId());
        System.out.println("CPF BANCO: " + usuario.getCpf());
        System.out.println("==================");

        usuario.setUltimoAcesso(LocalDateTime.now());
        
        UsuarioHome usuarioHome = new UsuarioHome(
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipo(),
                usuario.getFotoPerfil()
        );

        boolean hasNotifications = notificationsService.hasUnreadNotifications(usuario.getId());
        long unreadCount = notificationsService.countUnreadNotifications(usuario.getId());

        NotificacoesHome notificacoesHome = new NotificacoesHome(
                hasNotifications,
                unreadCount,
                hasNotifications ? "new" : "none"
        );

        PlanoHome planoHome = new PlanoHome(
                usuarioService.buscarPlanoUsuario(usuario)
        );

        AcessoHome acessoHome = new AcessoHome(
                usuarioService.calcularAccessState(usuario)
        );

        return new HomeResponse(
                true,
                "Home carregada com sucesso",
                usuarioHome,
                notificacoesHome,
                planoHome,
                acessoHome
        );
        }

        public record HomeResponse(
            boolean success,
            String message,
            UsuarioHome usuario,
            NotificacoesHome notificacoes,
            PlanoHome plano,
            AcessoHome acesso
        ) {}

        public record UsuarioHome(
            String nome,
            String email,
            String tipo,
            String avatar
            
        ) {}

        public record NotificacoesHome(
            boolean hasNotifications,
            long unreadCount,
            String initialBellState
        ) {}

        public record PlanoHome(
            String tier
        ) {}

        public record AcessoHome(
            String state
        ) {}
}