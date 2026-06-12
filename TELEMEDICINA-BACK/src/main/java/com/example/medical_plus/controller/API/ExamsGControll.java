package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.ExamsG;
import com.example.medical_plus.service.ExamsGService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exames-globais")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamsGControll {

    private final ExamsGService examsGService;

    public ExamsGControll(ExamsGService examsGService) {
        this.examsGService = examsGService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> buscarExamesGlobais(
            @RequestParam(required = false) String search
    ) {
        List<ExamsG> exames = examsGService.buscarExamesGlobais(search);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", exames.size());
        response.put("exames", exames);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarExameGlobalPorId(
            @PathVariable Long id
    ) {
        ExamsG exame = examsGService.buscarPorId(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exame", exame);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criarExameGlobal(
            @RequestBody ExamsG examsG
    ) {
        ExamsG criado = examsGService.criarExameGlobal(examsG);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exame", criado);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Map<String, Object>> desativarExameGlobal(
            @PathVariable Long id
    ) {
        ExamsG desativado = examsGService.desativarExameGlobal(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exame", desativado);

        return ResponseEntity.ok(response);
    }
}