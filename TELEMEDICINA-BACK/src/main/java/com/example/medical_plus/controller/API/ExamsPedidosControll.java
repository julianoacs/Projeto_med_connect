package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.PedidosExames;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.ExamsService;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exames-pedidos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamsPedidosControll {

    private final ExamsService examsService;

    public ExamsPedidosControll(ExamsService examsService) {
        this.examsService = examsService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criarPedidoExame(
            @RequestBody Map<String, Long> body,
            HttpSession session
    ) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            response.put("success", false);
            response.put("message", "Usuário não está logado");

            return ResponseEntity.status(401).body(response);
        }

        try {
            Long consultaId = body.get("consultaId");
            Long exameGlobalId = body.get("exameGlobalId");

            PedidosExames pedido = examsService.criarPedidoExame(
                    usuario,
                    consultaId,
                    exameGlobalId
            );

            response.put("success", true);
            response.put("message", "Pedido de exame criado com sucesso");
            response.put("pedido", pedido);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<Map<String, Object>> listarPedidosPorConsulta(
            @PathVariable Long consultaId,
            HttpSession session
    ) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            response.put("success", false);
            response.put("message", "Usuário não está logado");
            response.put("pedidos", List.of());

            return ResponseEntity.status(401).body(response);
        }

        try {
            List<Map<String, Object>> pedidos =
                    examsService.listarPedidosPorConsulta(consultaId);

            response.put("success", true);
            response.put("message", "Pedidos carregados com sucesso");
            response.put("pedidos", pedidos);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());
            response.put("pedidos", List.of());

            return ResponseEntity.badRequest().body(response);
        }
    }
}