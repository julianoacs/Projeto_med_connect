package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.ConsultaRoom;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.ConsultaRoomService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/consulta-room")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultaRoomControll {

    private final ConsultaRoomService consultaRoomService;

    public ConsultaRoomControll(ConsultaRoomService consultaRoomService) {
        this.consultaRoomService = consultaRoomService;
    }

    @GetMapping("/{consultaId}/contexto-paciente")
    public ResponseEntity<Map<String, Object>> buscarContextoPaciente(
            @PathVariable Long consultaId,
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
            Map<String, Object> contexto =
                    consultaRoomService.buscarContextoPaciente(consultaId, usuario);

            response.put("success", true);
            response.put("message", "Contexto do paciente carregado com sucesso");
            response.put("contexto", contexto);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{consultaId}/laudo-pdf")
    public ResponseEntity<byte[]> baixarLaudoPdf(
            @PathVariable Long consultaId,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            byte[] pdf = consultaRoomService.gerarLaudoPdf(consultaId, usuario);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=laudo-consulta-" + consultaId + ".pdf"
                    )
                    .body(pdf);

        } catch (Exception error) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{consultaId}/salvar")
    public ResponseEntity<Map<String, Object>> salvarRegistroConsulta(
            @PathVariable Long consultaId,
            @RequestBody Map<String, String> body,
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
            ConsultaRoom room = consultaRoomService.salvarRegistroConsulta(
                    consultaId,
                    usuario,
                    body.get("notasMedicas"),
                    body.get("observacoes"),
                    body.get("conduta"),
                    body.get("medicamentos")
            );

            response.put("success", true);
            response.put("message", "Registro da consulta salvo com sucesso");
            response.put("room", room);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{consultaId}/iniciar")
    public ResponseEntity<Map<String, Object>> iniciarConsulta(
            @PathVariable Long consultaId,
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
            ConsultaRoom room = consultaRoomService.iniciarConsulta(consultaId, usuario);

            response.put("success", true);
            response.put("message", "Consulta iniciada com sucesso");
            response.put("room", room);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{consultaId}/finalizar")
    public ResponseEntity<Map<String, Object>> finalizarConsulta(
            @PathVariable Long consultaId,
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
            ConsultaRoom room = consultaRoomService.finalizarConsulta(consultaId, usuario);

            response.put("success", true);
            response.put("message", "Consulta finalizada com sucesso");
            response.put("room", room);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            response.put("success", false);
            response.put("message", error.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }
}