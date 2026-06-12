package com.example.medical_plus.service;

import com.example.medical_plus.model.ExamsG;
import com.example.medical_plus.repository.ExamsGRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamsGService {

    private final ExamsGRepository examsGRepository;

    public ExamsGService(ExamsGRepository examsGRepository) {
        this.examsGRepository = examsGRepository;
    }

    public List<ExamsG> buscarExamesGlobais(String search) {
        if (search == null || search.trim().isEmpty()) {
            return examsGRepository.findByAtivoTrueOrderByNomeAsc();
        }

        return examsGRepository.buscarPorTexto(search.trim());
    }

    public ExamsG buscarPorId(Long id) {
        return examsGRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exame global não encontrado"));
    }

    public ExamsG criarExameGlobal(ExamsG examsG) {
        if (examsG.getNome() == null || examsG.getNome().isBlank()) {
            throw new RuntimeException("Nome do exame é obrigatório");
        }

        String nomeLimpo = examsG.getNome().trim();

        if (examsGRepository.findByNomeIgnoreCase(nomeLimpo).isPresent()) {
            throw new RuntimeException("Exame global já cadastrado");
        }

        examsG.setNome(nomeLimpo);
        examsG.setAtivo(true);

        return examsGRepository.save(examsG);
    }

    public ExamsG desativarExameGlobal(Long id) {
        ExamsG examsG = buscarPorId(id);
        examsG.setAtivo(false);

        return examsGRepository.save(examsG);
    }
}