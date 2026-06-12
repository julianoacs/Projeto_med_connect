package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Exams;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.ExamsService;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamsControll {

    private final ExamsService examsService;

    public ExamsControll(ExamsService examsService) {
        this.examsService = examsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> buscarExames(
            @RequestParam(required = false) String search
    ) {
        List<Exams> exames = examsService.buscarExames(search);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exames", exames);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/meus")
    public ResponseEntity<Map<String, Object>> meusExames(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            response.put("success", false);
            response.put("message", "Usuário não está logado");
            response.put("exames", List.of());

            return ResponseEntity.status(401).body(response);
        }

        List<Exams> exames = examsService.listarPorPaciente(usuario.getId());

        response.put("success", true);
        response.put("message", "Exames carregados com sucesso");
        response.put("exames", exames);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<Map<String, Object>> examesPorConsulta(
            @PathVariable Long consultaId,
            HttpSession session
    ) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            response.put("success", false);
            response.put("message", "Usuário não está logado");
            response.put("exames", List.of());

            return ResponseEntity.status(401).body(response);
        }

        List<Exams> exames = examsService.listarPorConsulta(consultaId);

        response.put("success", true);
        response.put("exames", exames);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criarExame(@RequestBody Exams exams) {
        Exams exameCriado = examsService.criarExame(exams);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exame", exameCriado);

        return ResponseEntity.ok(response);
    }
}