package com.example.medical_plus.service;

import com.example.medical_plus.dto.ExameDTO;
import com.example.medical_plus.model.*;
import com.example.medical_plus.repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioService {

    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private ExameGlobalRepository exameGlobalRepo;
    @Autowired private EspecialidadeGlobalRepository especialidadeGlobalRepo;

    @PostConstruct
    public void init() {
        if (usuarioRepo.findByEmailIgnoreCase("admin@medical.com").isEmpty()) {
            usuarioRepo.save(new Usuario("Administrador", "admin@medical.com", "123", "ADMIN"));
        }
    }

    // ── USUÁRIOS ──

    public void salvar(Usuario usuario) {
        usuarioRepo.save(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        return usuarioRepo.findByEmailAndSenha(email, senha).orElse(null);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepo.findByEmailIgnoreCase(email).orElse(null);
    }

    public List<Usuario> listarPacientes() {
        return usuarioRepo.findByTipoIgnoreCase("PACIENTE");
    }

    public List<Usuario> listarMedicos() {
        return usuarioRepo.findByTipoIgnoreCase("MEDICO");
    }

    public List<Usuario> listarMedicosPorExame(String exame) {
        return listarMedicos().stream()
                .filter(m -> m.getExames().contains(exame))
                .collect(Collectors.toList());
    }

    public void removerUsuarioPorEmail(String email) {
        usuarioRepo.findByEmailIgnoreCase(email).ifPresent(usuarioRepo::delete);
    }

    public void editarUsuario(String email, String novoNome, String novoCpf, String novaData, String novaEsp) {
        usuarioRepo.findByEmailIgnoreCase(email).ifPresent(u -> {
            if (novoNome != null && !novoNome.isBlank()) u.setNome(novoNome);
            if (novoCpf != null && !novoCpf.isBlank()) u.setCpf(novoCpf);
            if (novaData != null && !novaData.isBlank()) u.setDataNascimento(novaData);
            if (novaEsp != null && !novaEsp.isBlank()) u.setEspecialidade(novaEsp);
            usuarioRepo.save(u);
        });
    }

    // ── EXAMES DOS MÉDICOS ──

    public List<String> listarTodosExames() {
        return listarMedicos().stream()
                .flatMap(u -> u.getExames().stream())
                .distinct().toList();
    }

    public List<ExameDTO> listarTodosExamesComMedico() {
        return listarMedicos().stream()
                .flatMap(u -> u.getExames().stream().map(e -> new ExameDTO(e, u.getNome())))
                .toList();
    }

    public void adicionarExameAoMedico(Usuario usuario, String exame) {
        if (usuario == null || !"MEDICO".equalsIgnoreCase(usuario.getTipo())) return;
        usuario.adicionarExame(exame);
        usuarioRepo.save(usuario);
    }

    public void removerExameDoMedico(String exame, String nomeMedico) {
        listarMedicos().stream()
                .filter(m -> m.getNome().equalsIgnoreCase(nomeMedico))
                .findFirst()
                .ifPresent(m -> { m.removerExame(exame); usuarioRepo.save(m); });
    }

    // ── EXAMES GLOBAIS ──

    public List<String> listarExamesDisponiveis() {
        return exameGlobalRepo.findAll().stream().map(ExameGlobal::getNome).toList();
    }

    public void adicionarExameGlobal(String exame) {
        if (exame == null || exame.isBlank()) return;
        if (exameGlobalRepo.findByNomeIgnoreCase(exame.trim()).isEmpty())
            exameGlobalRepo.save(new ExameGlobal(exame.trim()));
    }

    public void removerExameGlobal(String exame) {
        exameGlobalRepo.findByNomeIgnoreCase(exame).ifPresent(exameGlobalRepo::delete);
    }

    // ── ESPECIALIDADES GLOBAIS ──

    public List<String> listarEspecialidades() {
        return especialidadeGlobalRepo.findAll().stream().map(EspecialidadeGlobal::getNome).toList();
    }

    public void adicionarEspecialidadeGlobal(String especialidade) {
        if (especialidade == null || especialidade.isBlank()) return;
        if (especialidadeGlobalRepo.findByNomeIgnoreCase(especialidade.trim()).isEmpty())
            especialidadeGlobalRepo.save(new EspecialidadeGlobal(especialidade.trim()));
    }

    public void removerEspecialidadeGlobal(String especialidade) {
        especialidadeGlobalRepo.findByNomeIgnoreCase(especialidade).ifPresent(especialidadeGlobalRepo::delete);
    }
}