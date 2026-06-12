package com.example.medical_plus.service;

import com.example.medical_plus.model.Consulta;
import com.example.medical_plus.model.ConsultaRoom;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.ConsultaRepository;
import com.example.medical_plus.repository.ConsultaRoomRepository;
import com.example.medical_plus.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConsultaRoomService {

    private final ConsultaRepository consultaRepository;
    private final ConsultaRoomRepository consultaRoomRepository;
    private final UsuarioRepository usuarioRepository;

    public ConsultaRoomService(
            ConsultaRepository consultaRepository,
            ConsultaRoomRepository consultaRoomRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.consultaRepository = consultaRepository;
        this.consultaRoomRepository = consultaRoomRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Map<String, Object> buscarContextoPaciente(Long consultaId, Usuario usuarioLogado) {
        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        validarAcessoConsulta(consulta, usuarioLogado);

        ConsultaRoom room = garantirConsultaRoom(consulta);

        Usuario paciente = usuarioRepository.findById(consulta.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Map<String, Object> contexto = new HashMap<>();

        contexto.put("paciente", montarPaciente(paciente));
        contexto.put("consulta", montarConsulta(consulta));
        contexto.put("room", montarRoom(room));

        if ("MEDICO".equalsIgnoreCase(usuarioLogado.getTipo())) {
            contexto.put(
                    "anotacoesOutrosMedicos",
                    montarAnotacoesAnteriores(
                            paciente.getId(),
                            consulta.getId()
                    )
            );

            contexto.put(
                    "consultasAnteriores",
                    montarConsultasAnteriores(
                            paciente.getId(),
                            consulta.getId()
                    )
            );
        } else {
            contexto.put("anotacoesOutrosMedicos", List.of());
            contexto.put("consultasAnteriores", List.of());
        }

        return contexto;
    }

    public ConsultaRoom iniciarConsulta(Long consultaId, Usuario usuarioLogado) {
        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        validarAcessoConsulta(consulta, usuarioLogado);
        validarMedicoOuAdmin(usuarioLogado);

        if ("FINALIZADA".equalsIgnoreCase(consulta.getStatus())) {
            throw new RuntimeException("Consulta já finalizada.");
        }

        ConsultaRoom room = garantirConsultaRoom(consulta);

        consulta.setStatus("EM_ANDAMENTO");
        consultaRepository.save(consulta);

        room.setStatus("EM_ANDAMENTO");
        room.setAtualizadoEm(LocalDateTime.now());

        return consultaRoomRepository.save(room);
    }

    public ConsultaRoom salvarRegistroConsulta(
            Long consultaId,
            Usuario usuarioLogado,
            String notasMedicas,
            String observacoes,
            String conduta,
            String medicamentos
    ) {
        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        validarAcessoConsulta(consulta, usuarioLogado);
        validarMedicoOuAdmin(usuarioLogado);

        ConsultaRoom room = garantirConsultaRoom(consulta);

        if ("FINALIZADA".equalsIgnoreCase(room.getStatus()) ||
                "FINALIZADA".equalsIgnoreCase(consulta.getStatus())) {
            throw new RuntimeException("Consulta já finalizada. Não é possível alterar o registro.");
        }

        room.setNotasMedicas(notasMedicas);
        room.setObservacoes(observacoes);
        room.setConduta(conduta);
        room.setMedicamentos(medicamentos);

        if (room.getStatus() == null || room.getStatus().isBlank()) {
            room.setStatus("EM_ANDAMENTO");
        }

        if (!"FINALIZADA".equalsIgnoreCase(room.getStatus())) {
            room.setStatus("EM_ANDAMENTO");
        }

        room.setAtualizadoEm(LocalDateTime.now());

        return consultaRoomRepository.save(room);
    }

    public ConsultaRoom finalizarConsulta(Long consultaId, Usuario usuarioLogado) {
        System.out.println("FINALIZANDO CONSULTA ID: " + consultaId);

        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        validarAcessoConsulta(consulta, usuarioLogado);
        validarMedicoOuAdmin(usuarioLogado);

        ConsultaRoom room = garantirConsultaRoom(consulta);

        room.setStatus("FINALIZADA");
        room.setAtualizadoEm(LocalDateTime.now());

        consulta.setStatus("FINALIZADA");
        consultaRepository.save(consulta);

        return consultaRoomRepository.save(room);
    }

public byte[] gerarLaudoPdf(Long consultaId, Usuario usuarioLogado) {
    if (usuarioLogado == null) {
        throw new RuntimeException("Usuário não está logado");
    }

    Consulta consulta = consultaRepository.findById(consultaId)
            .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

    validarAcessoConsulta(consulta, usuarioLogado);

    ConsultaRoom room = garantirConsultaRoom(consulta);

    Usuario paciente = usuarioRepository.findById(consulta.getPacienteId()).orElse(null);
    Usuario medico = usuarioRepository.findById(consulta.getMedicoId()).orElse(null);

    List<String> linhas = new ArrayList<>();

    linhas.add("MED CONNECT - LAUDO DA CONSULTA");
    linhas.add("");
    linhas.add("Consulta ID: " + valor(consulta.getId()));
    linhas.add("Status: " + valor(consulta.getStatus()));
    linhas.add("Data: " + valor(consulta.getData()));
    linhas.add("Hora: " + valor(consulta.getHora()));
    linhas.add("Especialidade: " + valor(consulta.getEspecialidade()));
    linhas.add("Motivo: " + valor(consulta.getMotivo()));
    linhas.add("");
    linhas.add("Paciente: " + (paciente != null ? valor(paciente.getNome()) : valor(consulta.getPacienteNome())));
    linhas.add("Email do paciente: " + (paciente != null ? valor(paciente.getEmail()) : "Não informado"));
    linhas.add("");
    linhas.add("Médico: " + (medico != null ? valor(medico.getNome()) : valor(consulta.getMedicoNome())));
    linhas.add("Registro: " + montarRegistroMedico(medico));
    linhas.add("");
    linhas.add("Notas médicas:");
    linhas.add(valor(room.getNotasMedicas()));
    linhas.add("");
    linhas.add("Observações:");
    linhas.add(valor(room.getObservacoes()));
    linhas.add("");
    linhas.add("Conduta:");
    linhas.add(valor(room.getConduta()));
    linhas.add("");
    linhas.add("Medicamentos:");
    linhas.add(valor(room.getMedicamentos()));
    linhas.add("");
    linhas.add("Gerado em: " + LocalDateTime.now());

    return montarPdfSimples(linhas);
}

    private String montarRegistroMedico(Usuario medico) {
        if (medico == null) {
            return "Registro não informado";
        }

        String tipoRegistro = medico.getTipoRegistro();
        String numeroRegistro = medico.getNumeroRegistro();

        if (tipoRegistro == null || tipoRegistro.isBlank() ||
                numeroRegistro == null || numeroRegistro.isBlank()) {
            return "Registro não informado";
        }

        return tipoRegistro + " " + numeroRegistro;
    }

    private String valor(Object valor) {
        if (valor == null) {
            return "Não informado";
        }

        String texto = String.valueOf(valor);

        if (texto.isBlank()) {
            return "Não informado";
        }

        return texto;
    }

    private byte[] montarPdfSimples(List<String> linhas) {
        StringBuilder conteudo = new StringBuilder();

        conteudo.append("BT\n");
        conteudo.append("/F1 11 Tf\n");
        conteudo.append("50 790 Td\n");
        conteudo.append("14 TL\n");

        for (String linha : linhas) {
            conteudo.append("(")
                    .append(escaparPdf(linha))
                    .append(") Tj\n");
            conteudo.append("T*\n");
        }

        conteudo.append("ET\n");

        byte[] conteudoBytes = conteudo.toString().getBytes(StandardCharsets.ISO_8859_1);

        List<String> objetos = new ArrayList<>();

        objetos.add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        objetos.add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
        objetos.add("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n");
        objetos.add("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n");
        objetos.add("5 0 obj\n<< /Length " + conteudoBytes.length + " >>\nstream\n" + conteudo + "endstream\nendobj\n");

        ByteArrayOutputStream pdf = new ByteArrayOutputStream();

        escreverPdf(pdf, "%PDF-1.4\n");

        List<Integer> offsets = new ArrayList<>();

        for (String objeto : objetos) {
            offsets.add(pdf.size());
            escreverPdf(pdf, objeto);
        }

        int inicioXref = pdf.size();

        escreverPdf(pdf, "xref\n");
        escreverPdf(pdf, "0 " + (objetos.size() + 1) + "\n");
        escreverPdf(pdf, "0000000000 65535 f \n");

        for (Integer offset : offsets) {
            escreverPdf(pdf, String.format("%010d 00000 n \n", offset));
        }

        escreverPdf(pdf, "trailer\n");
        escreverPdf(pdf, "<< /Size " + (objetos.size() + 1) + " /Root 1 0 R >>\n");
        escreverPdf(pdf, "startxref\n");
        escreverPdf(pdf, String.valueOf(inicioXref));
        escreverPdf(pdf, "\n%%EOF");

        return pdf.toByteArray();
    }

    private void escreverPdf(ByteArrayOutputStream pdf, String texto) {
        try {
            pdf.write(texto.getBytes(StandardCharsets.ISO_8859_1));
        } catch (Exception error) {
            throw new RuntimeException("Erro ao gerar PDF", error);
        }
    }

    private String escaparPdf(String texto) {
        if (texto == null) {
            return "";
        }

        return texto
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)")
                .replace("\r", "")
                .replace("\n", " ");
    }

    private ConsultaRoom garantirConsultaRoom(Consulta consulta) {
        return consultaRoomRepository.findByConsultaId(consulta.getId())
                .orElseGet(() -> {
                    ConsultaRoom room = new ConsultaRoom();

                    room.setConsultaId(consulta.getId());
                    room.setPacienteId(consulta.getPacienteId());
                    room.setMedicoId(consulta.getMedicoId());
                    room.setStatus("EM_ANDAMENTO");
                    room.setCriadoEm(LocalDateTime.now());

                    return consultaRoomRepository.save(room);
                });
    }

    private void validarAcessoConsulta(Consulta consulta, Usuario usuarioLogado) {
        boolean isMedicoDaConsulta =
                consulta.getMedicoId() != null &&
                consulta.getMedicoId().equals(usuarioLogado.getId());

        boolean isPacienteDaConsulta =
                consulta.getPacienteId() != null &&
                consulta.getPacienteId().equals(usuarioLogado.getId());

        boolean isAdmin =
                "ADMIN".equalsIgnoreCase(usuarioLogado.getTipo());

        if (!isMedicoDaConsulta && !isPacienteDaConsulta && !isAdmin) {
            throw new RuntimeException("Essa consulta não pertence ao usuário logado");
        }
    }

    private void validarMedicoOuAdmin(Usuario usuarioLogado) {
        boolean isMedico = "MEDICO".equalsIgnoreCase(usuarioLogado.getTipo());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(usuarioLogado.getTipo());

        if (!isMedico && !isAdmin) {
            throw new RuntimeException("Apenas médico ou admin pode registrar consulta");
        }
    }

    private Map<String, Object> montarPaciente(Usuario paciente) {
        Map<String, Object> map = new HashMap<>();

        map.put("id", paciente.getId());
        map.put("nome", paciente.getNome());
        map.put("email", paciente.getEmail());
        map.put("avatar", paciente.getFotoPerfil());
        map.put("idade", calcularIdade(paciente.getDataNascimento()));
        map.put("sexo", "Masculino");

        return map;
    }

    private Map<String, Object> montarConsulta(Consulta consulta) {
        Map<String, Object> map = new HashMap<>();

        Usuario medico = usuarioRepository.findById(consulta.getMedicoId()).orElse(null);

        String medicoTipoRegistro = medico != null ? medico.getTipoRegistro() : null;
        String medicoNumeroRegistro = medico != null ? medico.getNumeroRegistro() : null;

        String medicoRegistro = "Registro não informado";

        if (medicoTipoRegistro != null && medicoNumeroRegistro != null &&
                !medicoTipoRegistro.isBlank() && !medicoNumeroRegistro.isBlank()) {
            medicoRegistro = medicoTipoRegistro + " " + medicoNumeroRegistro;
        }

        map.put("id", consulta.getId());
        map.put("pacienteId", consulta.getPacienteId());
        map.put("medicoId", consulta.getMedicoId());
        map.put("medicoNome", consulta.getMedicoNome());
        map.put("pacienteNome", consulta.getPacienteNome());
        map.put("especialidade", consulta.getEspecialidade());
        map.put("motivo", consulta.getMotivo());
        map.put("data", consulta.getData());
        map.put("hora", consulta.getHora());
        map.put("status", consulta.getStatus());
        map.put("tipoConsulta", consulta.getTipoConsulta());
        map.put("local", consulta.getLocal());

        map.put("medicoTipoRegistro", medicoTipoRegistro);
        map.put("medicoNumeroRegistro", medicoNumeroRegistro);
        map.put("medicoRegistro", medicoRegistro);

        return map;
    }

    private Map<String, Object> montarRoom(ConsultaRoom room) {
        Map<String, Object> map = new HashMap<>();

        map.put("id", room.getId());
        map.put("consultaId", room.getConsultaId());
        map.put("pacienteId", room.getPacienteId());
        map.put("medicoId", room.getMedicoId());
        map.put("notasMedicas", room.getNotasMedicas());
        map.put("observacoes", room.getObservacoes());
        map.put("conduta", room.getConduta());
        map.put("medicamentos", room.getMedicamentos());
        map.put("status", room.getStatus());
        map.put("criadoEm", room.getCriadoEm());
        map.put("atualizadoEm", room.getAtualizadoEm());

        return map;
    }

    

    private List<Map<String, Object>> montarAnotacoesOutrosMedicos(
            Long pacienteId,
            Long medicoLogadoId
    ) {
        List<ConsultaRoom> registros =
                consultaRoomRepository.findTop3ByPacienteIdAndMedicoIdNotOrderByCriadoEmDesc(
                        pacienteId,
                        medicoLogadoId
                );

        return registros.stream().map(registro -> {
            Map<String, Object> map = new HashMap<>();

            Usuario medico = usuarioRepository.findById(registro.getMedicoId()).orElse(null);

            map.put("id", registro.getId());
            map.put("data", registro.getCriadoEm());
            map.put("medicoNome", medico != null ? medico.getNome() : "Médico não encontrado");
            map.put("resumo", primeiroTextoValido(
                    registro.getNotasMedicas(),
                    registro.getObservacoes(),
                    registro.getConduta()
            ));

            return map;
        }).toList();
    }

    private List<Map<String, Object>> montarConsultasAnteriores(
            Long pacienteId,
            Long consultaAtualId
    ) {
        List<Consulta> consultas =
                consultaRepository.findByPacienteIdOrderByDataDescHoraDesc(pacienteId);

        return consultas.stream()
                .filter(consulta -> !consulta.getId().equals(consultaAtualId))
                .limit(3)
                .map(consulta -> {
                    Map<String, Object> map = new HashMap<>();

                    map.put("id", consulta.getId());
                    map.put("data", consulta.getData());
                    map.put("hora", consulta.getHora());
                    map.put("motivo", consulta.getMotivo());
                    map.put("tipoConsulta", consulta.getTipoConsulta());
                    map.put("status", consulta.getStatus());

                    return map;
                })
                .toList();
    }

    private List<Map<String, Object>> montarAnotacoesAnteriores(
            Long pacienteId,
            Long consultaAtualId
    ) {
        List<ConsultaRoom> registros =
                consultaRoomRepository.findTop3ByPacienteIdAndConsultaIdNotOrderByCriadoEmDesc(
                        pacienteId,
                        consultaAtualId
                );

        return registros.stream().map(registro -> {
            Map<String, Object> map = new HashMap<>();

            Usuario medico = usuarioRepository.findById(registro.getMedicoId()).orElse(null);

            map.put("id", registro.getId());
            map.put("data", registro.getCriadoEm());
            map.put("medicoNome", medico != null ? medico.getNome() : "Médico não encontrado");
            map.put("resumo", primeiroTextoValido(
                    registro.getNotasMedicas(),
                    registro.getObservacoes(),
                    registro.getConduta(),
                    registro.getMedicamentos()
            ));

            return map;
        }).toList();
    }


    private String primeiroTextoValido(String... textos) {
        for (String texto : textos) {
            if (texto != null && !texto.isBlank()) {
                return texto;
            }
        }

        return "Registro sem resumo clínico.";
    }

    private Integer calcularIdade(String dataNascimento) {
        if (dataNascimento == null || dataNascimento.isBlank()) {
            return null;
        }

        try {
            String anoTexto;

            if (dataNascimento.contains("/")) {
                String[] partes = dataNascimento.split("/");
                anoTexto = partes[2];
            } else {
                anoTexto = dataNascimento.substring(0, 4);
            }

            int anoNascimento = Integer.parseInt(anoTexto);

            return 2026 - anoNascimento;
        } catch (Exception error) {
            return null;
        }
    }

}