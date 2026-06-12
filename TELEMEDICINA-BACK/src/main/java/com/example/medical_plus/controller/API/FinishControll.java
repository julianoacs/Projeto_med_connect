package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Consulta;
import com.example.medical_plus.model.ConsultaRoom;
import com.example.medical_plus.repository.ConsultaRepository;
import com.example.medical_plus.repository.ConsultaRoomRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finish")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FinishControll {

    private final ConsultaRepository consultaRepository;
    private final ConsultaRoomRepository consultaRoomRepository;

    public FinishControll(
            ConsultaRepository consultaRepository,
            ConsultaRoomRepository consultaRoomRepository
    ) {
        this.consultaRepository = consultaRepository;
        this.consultaRoomRepository = consultaRoomRepository;
    }

    @GetMapping("/check")
    public Map<String, Object> verificarConsultasFinalizadas() {
        Map<String, Object> response = new HashMap<>();

        List<Consulta> consultas = consultaRepository.findAll();

        int finalizadas = 0;

        for (Consulta consulta : consultas) {
            if ("FINALIZADA".equalsIgnoreCase(consulta.getStatus())) {
                continue;
            }

            if (consulta.getData() == null || consulta.getHora() == null) {
                continue;
            }

            try {
                String hora = consulta.getHora();

                if (hora.length() == 5) {
                    hora = hora + ":00";
                }

                LocalDateTime dataHoraConsulta = LocalDateTime.parse(
                        consulta.getData() + "T" + hora
                );

                LocalDateTime limiteConsulta = dataHoraConsulta.plusMinutes(10);

                if (limiteConsulta.isBefore(LocalDateTime.now())) {
                    consulta.setStatus("FINALIZADA");
                    consultaRepository.save(consulta);

                    ConsultaRoom room = consultaRoomRepository
                            .findByConsultaId(consulta.getId())
                            .orElse(null);

                    if (room != null) {
                        room.setStatus("FINALIZADA");
                        room.setAtualizadoEm(LocalDateTime.now());
                        consultaRoomRepository.save(room);
                    }

                    finalizadas++;
                }
            } catch (Exception error) {
                System.out.println(
                        "Erro ao verificar consulta "
                                + consulta.getId()
                                + ": "
                                + error.getMessage()
                );
            }
        }

        response.put("success", true);
        response.put("message", "Verificação concluída");
        response.put("finalizadas", finalizadas);

        return response;
    }
}