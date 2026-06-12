package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Agendamento;
import com.example.medical_plus.model.Consulta;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.AgendamentoRepository;
import com.example.medical_plus.repository.ConsultaRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medico/agendamentos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MedAgdControll {

    private final AgendamentoRepository agendamentoRepository;
    private final ConsultaRepository consultaRepository;

    public MedAgdControll(
            AgendamentoRepository agendamentoRepository,
            ConsultaRepository consultaRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.consultaRepository = consultaRepository;
    }

    @GetMapping
    public MedAgdResponse getAgendamentosMedico(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new MedAgdResponse(
                    false,
                    "Usuário não está logado",
                    List.of()
            );
        }

        if (!"MEDICO".equalsIgnoreCase(usuario.getTipo())) {
            return new MedAgdResponse(
                    false,
                    "Usuário não é médico",
                    List.of()
            );
        }

        List<Agendamento> agendamentos = agendamentoRepository
                .findByMedicoIgnoreCase(usuario.getNome());

        return new MedAgdResponse(
                true,
                "Agendamentos carregados com sucesso",
                agendamentos
        );
    }

    @PutMapping("/{id}/aceitar")
    public MedAgdActionResponse aceitarAgendamento(
            @PathVariable Long id,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new MedAgdActionResponse(
                    false,
                    "Usuário não está logado"
            );
        }

        if (!"MEDICO".equalsIgnoreCase(usuario.getTipo())) {
            return new MedAgdActionResponse(
                    false,
                    "Usuário não é médico"
            );
        }

        Agendamento agendamento = agendamentoRepository
                .findById(id)
                .orElse(null);

        if (agendamento == null) {
            return new MedAgdActionResponse(
                    false,
                    "Agendamento não encontrado"
            );
        }

        if (!agendamento.getMedico().equalsIgnoreCase(usuario.getNome())) {
            return new MedAgdActionResponse(
                    false,
                    "Esse agendamento não pertence a esse médico"
            );
        }

        boolean horarioJaConfirmado = consultaRepository.existsByMedicoIdAndDataAndHora(
                agendamento.getMedicoId(),
                agendamento.getData(),
                agendamento.getHora()
        );

        if (horarioJaConfirmado) {
                return new MedAgdActionResponse(
                        false,
                        "Esse horário já foi confirmado para outro paciente"
                );
        }
        
        Consulta consulta = new Consulta();

        consulta.setPacienteId(agendamento.getPacienteId());
        consulta.setMedicoId(agendamento.getMedicoId());

        consulta.setMedicoNome(agendamento.getMedico());

        consulta.setPacienteNome(agendamento.getNomeUsuario());
        consulta.setPacienteEmail(agendamento.getEmailUsuario());

        consulta.setEspecialidade(agendamento.getEspecialidade());
        consulta.setMotivo(agendamento.getExame());

        consulta.setData(agendamento.getData());
        consulta.setHora(agendamento.getHora());

        consulta.setTipoConsulta(agendamento.getTipoConsulta());
        consulta.setLocal(agendamento.getLocal());

        consulta.setStatus("CONFIRMADA");

        consultaRepository.save(consulta);
        agendamentoRepository.delete(agendamento);

        return new MedAgdActionResponse(
                true,
                "Agendamento aceito e consulta criada com sucesso"
        );
    }

    @PutMapping("/{id}/recusar")
    public MedAgdActionResponse recusarAgendamento(
            @PathVariable Long id,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new MedAgdActionResponse(
                    false,
                    "Usuário não está logado"
            );
        }

        if (!"MEDICO".equalsIgnoreCase(usuario.getTipo())) {
            return new MedAgdActionResponse(
                    false,
                    "Usuário não é médico"
            );
        }

        Agendamento agendamento = agendamentoRepository
                .findById(id)
                .orElse(null);

        if (agendamento == null) {
            return new MedAgdActionResponse(
                    false,
                    "Agendamento não encontrado"
            );
        }

        if (!agendamento.getMedico().equalsIgnoreCase(usuario.getNome())) {
            return new MedAgdActionResponse(
                    false,
                    "Esse agendamento não pertence a esse médico"
            );
        }

        agendamentoRepository.delete(agendamento);

        return new MedAgdActionResponse(
                true,
                "Agendamento recusado e removido com sucesso"
        );
    }

    public record MedAgdResponse(
            boolean success,
            String message,
            List<Agendamento> agendamentos
    ) {}

    public record MedAgdActionResponse(
            boolean success,
            String message
    ) {}
}