package com.example.medical_plus.service;

import com.example.medical_plus.model.Consulta;
import com.example.medical_plus.model.Exams;
import com.example.medical_plus.model.ExamsG;
import com.example.medical_plus.model.PedidosExames;
import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.repository.ConsultaRepository;
import com.example.medical_plus.repository.ExamsRepository;
import com.example.medical_plus.repository.PedidosExamesRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ExamsService {

    private final ExamsRepository examsRepository;
    private final ExamsGService examsGService;
    private final ConsultaRepository consultaRepository;
    private final PedidosExamesRepository pedidosExamesRepository;

    public ExamsService(
            ExamsRepository examsRepository,
            ExamsGService examsGService,
            ConsultaRepository consultaRepository,
            PedidosExamesRepository pedidosExamesRepository
    ) {
        this.examsRepository = examsRepository;
        this.examsGService = examsGService;
        this.consultaRepository = consultaRepository;
        this.pedidosExamesRepository = pedidosExamesRepository;
    }

    public List<Exams> buscarExames(String search) {
        if (search == null || search.trim().isEmpty()) {
            return examsRepository.findByAtivoTrueOrderByNomeAsc();
        }

        return examsRepository.findByAtivoTrueAndNomeContainingIgnoreCaseOrderByNomeAsc(search.trim());
    }

    public Exams criarExame(Exams exams) {
        exams.setAtivo(true);

        if (exams.getStatus() == null || exams.getStatus().isBlank()) {
            exams.setStatus("ENVIADO");
        }

        if (exams.getCriadoEm() == null) {
            exams.setCriadoEm(LocalDateTime.now());
        }

        return examsRepository.save(exams);
    }

    public PedidosExames criarPedidoExame(
            Usuario usuario,
            Long consultaId,
            Long exameGlobalId
    ) {
        if (usuario == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        if (consultaId == null) {
            throw new RuntimeException("Consulta não informada");
        }

        if (exameGlobalId == null) {
            throw new RuntimeException("Exame global não informado");
        }

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        Long medicoId = consulta.getMedicoId();

        boolean isMedicoDaConsulta =
                medicoId != null && medicoId.equals(usuario.getId());

        boolean isAdmin =
                "ADMIN".equalsIgnoreCase(usuario.getTipo());

        if (!isMedicoDaConsulta && !isAdmin) {
            throw new RuntimeException("Essa consulta não pertence ao médico logado");
        }

        ExamsG exameGlobal = examsGService.buscarPorId(exameGlobalId);

        PedidosExames pedido = new PedidosExames();

        pedido.setConsultaId(consultaId);
        pedido.setExameId(exameGlobal.getId());
        pedido.setStatus("PENDENTE");
        pedido.setResultado(null);
        pedido.setDataSolicitacao(LocalDateTime.now());

        return pedidosExamesRepository.save(pedido);
    }

    public List<Map<String, Object>> listarPedidosPorConsulta(Long consultaId) {
        List<PedidosExames> pedidos =
                pedidosExamesRepository.findByConsultaIdOrderByDataSolicitacaoDesc(consultaId);

        return pedidos.stream().map((pedido) -> {
            ExamsG exameGlobal = examsGService.buscarPorId(pedido.getExameId());

            Map<String, Object> item = new HashMap<>();

            item.put("id", pedido.getId());
            item.put("consultaId", pedido.getConsultaId());
            item.put("exameGlobalId", pedido.getExameId());
            item.put("nome", exameGlobal.getNome());
            item.put("descricao", exameGlobal.getDescricao());
            item.put("categoria", exameGlobal.getCategoria());
            item.put("tipo", exameGlobal.getTipo());
            item.put("status", pedido.getStatus());
            item.put("resultado", pedido.getResultado());
            item.put("criadoEm", pedido.getDataSolicitacao());

            return item;
        }).toList();
    }

    public Exams salvarExameEnviado(
            Usuario usuario,
            Long pedidoExameId,
            Long exameGlobalId,
            Long consultaId,
            MultipartFile arquivo
    ) {
        if (usuario == null) {
            throw new RuntimeException("Usuário não está logado");
        }

        if (pedidoExameId == null) {
            throw new RuntimeException("Pedido de exame não informado");
        }

        if (exameGlobalId == null) {
            throw new RuntimeException("Exame global não informado");
        }

        if (consultaId == null) {
            throw new RuntimeException("Consulta não informada");
        }

        if (arquivo == null || arquivo.isEmpty()) {
            throw new RuntimeException("Arquivo do exame é obrigatório");
        }

        PedidosExames pedido = pedidosExamesRepository.findById(pedidoExameId)
                .orElseThrow(() -> new RuntimeException("Pedido de exame não encontrado"));

        if (!consultaId.equals(pedido.getConsultaId())) {
            throw new RuntimeException("Esse pedido não pertence à consulta informada");
        }

        if (!exameGlobalId.equals(pedido.getExameId())) {
            throw new RuntimeException("Esse exame não corresponde ao pedido selecionado");
        }

        ExamsG exameGlobal = examsGService.buscarPorId(exameGlobalId);

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        Long pacienteId = consulta.getPacienteId();
        Long medicoId = consulta.getMedicoId();

        boolean isPacienteDaConsulta =
                pacienteId != null && pacienteId.equals(usuario.getId());

        boolean isMedicoDaConsulta =
                medicoId != null && medicoId.equals(usuario.getId());

        boolean isAdmin =
                "ADMIN".equalsIgnoreCase(usuario.getTipo());

        if (!isPacienteDaConsulta && !isMedicoDaConsulta && !isAdmin) {
            throw new RuntimeException("Essa consulta não pertence ao usuário logado");
        }

        try {
            String nomeOriginal = arquivo.getOriginalFilename();
            String extensao = "";

            if (nomeOriginal != null && nomeOriginal.contains(".")) {
                extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
            }

            String nomeArquivoSalvo = UUID.randomUUID() + extensao;

            Path pasta = Paths.get(
                    "uploads",
                    "exames",
                    "paciente-" + pacienteId,
                    "consulta-" + consultaId
            );

            Files.createDirectories(pasta);

            Path caminhoArquivo = pasta.resolve(nomeArquivoSalvo);

            Files.write(caminhoArquivo, arquivo.getBytes());

            Exams exame = new Exams();

            exame.setPacienteId(pacienteId);
            exame.setMedicoId(medicoId);
            exame.setConsultaId(consultaId);
            exame.setExameGlobalId(exameGlobal.getId());
            exame.setPedidoExameId(pedidoExameId);

            exame.setNome(exameGlobal.getNome());
            exame.setDescricao(exameGlobal.getDescricao());
            exame.setCategoria(exameGlobal.getCategoria());
            exame.setTipo(exameGlobal.getTipo());

            exame.setArquivoNome(nomeOriginal);
            exame.setArquivoPath(
                    "/uploads/exames/paciente-" + pacienteId +
                    "/consulta-" + consultaId +
                    "/" + nomeArquivoSalvo
            );
            exame.setArquivoTipo(arquivo.getContentType());

            exame.setStatus("ENVIADO");
            exame.setAtivo(true);
            exame.setCriadoEm(LocalDateTime.now());

            Exams exameSalvo = examsRepository.save(exame);

            pedido.setStatus("ENVIADO");
            pedido.setResultado(exameSalvo.getArquivoPath());
            pedidosExamesRepository.save(pedido);

            return exameSalvo;

        } catch (Exception error) {
            throw new RuntimeException("Erro ao salvar exame: " + error.getMessage());
        }
    }

    public List<Exams> listarPorPaciente(Long pacienteId) {
        return examsRepository.findByPacienteIdOrderByCriadoEmDesc(pacienteId);
    }

    public List<Exams> listarPorConsulta(Long consultaId) {
        return examsRepository.findByConsultaIdOrderByCriadoEmDesc(consultaId);
    }

    public List<Exams> listarPorMedico(Long medicoId) {
        return examsRepository.findByMedicoIdOrderByCriadoEmDesc(medicoId);
    }

    public List<Exams> listarPorPacienteEConsulta(Long pacienteId, Long consultaId) {
        return examsRepository.findByPacienteIdAndConsultaIdOrderByCriadoEmDesc(
                pacienteId,
                consultaId
        );
    }
}