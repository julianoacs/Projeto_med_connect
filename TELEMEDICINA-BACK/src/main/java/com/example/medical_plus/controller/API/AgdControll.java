package com.example.medical_plus.controller.API;

import com.example.medical_plus.controller.API.AgdControll.MarcarHorarioResponse;
import com.example.medical_plus.model.Agendamento;
import com.example.medical_plus.model.Horario;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.AgendamentoRepository;
import com.example.medical_plus.repository.HorarioRepository;
import com.example.medical_plus.repository.ConsultaRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AgdControll {

        private final HorarioRepository horarioRepository;
        private final AgendamentoRepository agendamentoRepository;
        private final ConsultaRepository consultaRepository;

        public AgdControll(
                HorarioRepository horarioRepository,
                AgendamentoRepository agendamentoRepository,
                ConsultaRepository consultaRepository
        ) {
        this.horarioRepository = horarioRepository;
        this.agendamentoRepository = agendamentoRepository;
        this.consultaRepository = consultaRepository;
        }

    @GetMapping("/dias")
    public DiasResponse getDias(
            @RequestParam String start,
            @RequestParam(defaultValue = "7") int limit,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new DiasResponse(false, "Usuário não está logado", List.of());
        }

        LocalDate startDate = LocalDate.parse(start);
        Locale ptBr = Locale.forLanguageTag("pt-BR");

        List<DiaItem> dias = java.util.stream.IntStream
                .range(0, limit)
                .mapToObj(index -> {
                    LocalDate data = startDate.plusDays(index);

                    return new DiaItem(
                            data.toString(),
                            data.format(DateTimeFormatter.ofPattern("EEE", ptBr)),
                            String.format("%02d", data.getDayOfMonth()),
                            data.format(DateTimeFormatter.ofPattern("MMM", ptBr))
                    );
                })
                .toList();

        return new DiasResponse(true, "Dias carregados com sucesso", dias);
    }

        @GetMapping("/horarios")
        public HorariosResponse getHorarios(
                @RequestParam String medico,
                @RequestParam String data,
                HttpSession session
        ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
                return new HorariosResponse(false, "Usuário não está logado", List.of());
        }

        List<HorarioItem> horarios = horarioRepository
                .findByAtivoTrueOrderByHoraAsc()
                .stream()
                .map(horario -> {
                        String hora = horario.getHora().toString();

                        boolean ocupadoPorAgendamento = agendamentoRepository
                                .existsByMedicoIgnoreCaseAndDataAndHora(
                                        medico,
                                        data,
                                        hora
                                );

                        boolean ocupadoPorConsulta = consultaRepository
                                .findAll()
                                .stream()
                                .anyMatch(consulta ->
                                        consulta.getMedicoNome() != null &&
                                        consulta.getMedicoNome().equalsIgnoreCase(medico) &&
                                        consulta.getData() != null &&
                                        consulta.getData().equals(data) &&
                                        consulta.getHora() != null &&
                                        consulta.getHora().equals(hora) &&
                                        !"CANCELADA".equalsIgnoreCase(consulta.getStatus())
                                );

                        boolean ocupado = ocupadoPorAgendamento || ocupadoPorConsulta;

                        return new HorarioItem(
                                horario.getId(),
                                hora,
                                ocupado
                        );
                })
                .toList();

        return new HorariosResponse(true, "Horários carregados com sucesso", horarios);
        }

    @PostMapping("/horarios")
    public MarcarHorarioResponse marcarHorario(
            @RequestBody MarcarHorarioRequest request,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new MarcarHorarioResponse(false, "Usuário não está logado");
        }

        boolean ocupado = agendamentoRepository.existsByMedicoIgnoreCaseAndDataAndHora(
                request.medicoNome(),
                request.data(),
                request.hora()
        );

        if (ocupado) {
            return new MarcarHorarioResponse(false, "Esse horário já está ocupado");
        }

        Agendamento agendamento = new Agendamento(
                request.motivo(),
                request.medicoNome(),
                request.data(),
                request.hora(),
                usuario.getEmail(),
                request.pacienteNome()
        );

        agendamento.setPacienteId(usuario.getId());
        agendamento.setMedicoId(request.medicoId());
        agendamento.setStatus("PENDENTE");
        agendamento.setLocal("ONLINE");
        agendamento.setTipoConsulta("ONLINE");
        agendamento.setTelefone("");
        agendamento.setEspecialidade(request.especialidade());

        agendamentoRepository.save(agendamento);

        return new MarcarHorarioResponse(true, "Agendamento criado com sucesso");
    }

    public record DiasResponse(
            boolean success,
            String message,
            List<DiaItem> dias
    ) {}

    public record DiaItem(
            String value,
            String week,
            String day,
            String month
    ) {}

    public record HorariosResponse(
            boolean success,
            String message,
            List<HorarioItem> horarios
    ) {}

    public record HorarioItem(
            Long id,
            String hora,
            boolean ocupado
    ) {}

    public record MarcarHorarioRequest(
            Long medicoId,
            String medicoNome,
            String especialidade,
            String pacienteNome,
            String data,
            String hora,
            String motivo
    ) {}

    public record MarcarHorarioResponse(
            boolean success,
            String message
    ) {}
}
