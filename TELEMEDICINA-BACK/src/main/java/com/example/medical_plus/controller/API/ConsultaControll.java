package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Consulta;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.ConsultaRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultaControll {

    private final ConsultaRepository consultaRepository;

    public ConsultaControll(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    @GetMapping("/minhas")
    public ConsultasResponse minhasConsultas(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new ConsultasResponse(
                    false,
                    "Usuário não está logado",
                    List.of()
            );
        }

        List<Consulta> consultas;

        if ("MEDICO".equalsIgnoreCase(usuario.getTipo())) {
            consultas = consultaRepository.findByMedicoIdOrderByDataAscHoraAsc(usuario.getId());
        } else {
            consultas = consultaRepository.findByPacienteIdOrderByDataAscHoraAsc(usuario.getId());
        }

        return new ConsultasResponse(
                true,
                "Consultas carregadas com sucesso",
                consultas
        );
    }

    public record ConsultasResponse(
            boolean success,
            String message,
            List<Consulta> consultas
    ) {}
}