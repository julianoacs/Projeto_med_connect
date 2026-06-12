package com.example.medical_plus.service;

import com.example.medical_plus.model.Agendamento;
import com.example.medical_plus.repository.AgendamentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AgendamentoService {

    @Autowired private AgendamentoRepository agendamentoRepo;

    public void salvar(Agendamento agendamento) {
        agendamentoRepo.save(agendamento);
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepo.findAll();
    }

    public List<Agendamento> listarPorUsuario(String email) {
        return agendamentoRepo.findByEmailUsuario(email);
    }

    public List<Agendamento> listarPorMedico(String nomeMedico) {
        return agendamentoRepo.findByMedicoIgnoreCase(nomeMedico);
    }

    public void agendar(String exame, String medico, String data, String hora, String emailUsuario, String nomeUsuario) {
        agendamentoRepo.save(new Agendamento(exame, medico, data, hora, emailUsuario, nomeUsuario));
    }

    public void aceitar(int index, String nomeMedico) {
        List<Agendamento> lista = listarPorMedico(nomeMedico);
        if (index >= 0 && index < lista.size()) {
            Agendamento ag = lista.get(index);
            ag.setStatus("ACEITO");
            agendamentoRepo.save(ag);
        }
    }

    public void recusar(int index, String nomeMedico) {
        List<Agendamento> lista = listarPorMedico(nomeMedico);
        if (index >= 0 && index < lista.size()) {
            Agendamento ag = lista.get(index);
            ag.setStatus("RECUSADO");
            agendamentoRepo.save(ag);
        }
    }

    public void atualizarStatus(Long id, String status) {
        agendamentoRepo.findById(id).ifPresent(ag -> {
            ag.setStatus(status);
            agendamentoRepo.save(ag);
        });
    }

    public void deletarPorId(Long id) {
        agendamentoRepo.deleteById(id);
    }

    public void cancelar(int index) {
        List<Agendamento> todos = listarTodos();
        if (index >= 0 && index < todos.size()) {
            Agendamento ag = todos.get(index);
            ag.setStatus("CANCELADO");
            agendamentoRepo.save(ag);
        }
    }

    public void remover(int index, String email) {
        List<Agendamento> lista = listarPorUsuario(email);
        if (index >= 0 && index < lista.size()) agendamentoRepo.delete(lista.get(index));
    }

    public void removerAdmin(int index) {
        List<Agendamento> todos = listarTodos();
        if (index >= 0 && index < todos.size()) agendamentoRepo.delete(todos.get(index));
    }

    public Agendamento buscarPorIndex(int index) {
        List<Agendamento> todos = listarTodos();
        return (index >= 0 && index < todos.size()) ? todos.get(index) : null;
    }
}