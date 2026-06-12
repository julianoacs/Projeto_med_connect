package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Exams;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.ExamsService;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/exames-envios")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamsEnvControll {

    private final ExamsService examsService;

    public ExamsEnvControll(ExamsService examsService) {
        this.examsService = examsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Endpoint de envio de exames ativo");
        response.put("method", "Use POST para enviar exame");

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> enviarExame(
            @RequestParam Long pedidoExameId,
            @RequestParam Long exameGlobalId,
            @RequestParam Long consultaId,
            @RequestParam MultipartFile arquivo,
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
            Exams exameSalvo = examsService.salvarExameEnviado(
                    usuario,
                    pedidoExameId,
                    exameGlobalId,
                    consultaId,
                    arquivo
            );

            response.put("success", true);
            response.put("message", "Exame enviado e salvo com sucesso");
            response.put("exame", exameSalvo);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }
}