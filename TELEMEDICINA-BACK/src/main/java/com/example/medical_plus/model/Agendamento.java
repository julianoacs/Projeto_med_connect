package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medico_id", nullable = false)
    private Long medicoId;
    private String exame;
    private String medico;
    private String especialidade;
    private String data;
    private String hora;
    private String emailUsuario;
    private String nomeUsuario;
    private String status = "PENDENTE";
    private String local;
    private String tipoConsulta;
    private String telefone;

    @Column(name = "paciente_id")
    private Long pacienteId;

    public Agendamento() {
    }

    public Agendamento(
            String exame,
            String medico,
            String data,
            String hora,
            String emailUsuario,
            String nomeUsuario
    ) {
        this.exame = exame;
        this.medico = medico;
        this.data = data;
        this.hora = hora;
        this.emailUsuario = emailUsuario;
        this.nomeUsuario = nomeUsuario;
    }
    
    // GETTERS
    public Long getId() { return id; }
    public Long getMedicoId() { return medicoId; }
    public String getEspecialidade() { return especialidade; }
    public String getExame() { return exame; }
    public String getMedico() { return medico; }
    public String getData() { return data; }
    public String getHora() { return hora; }
    public String getEmailUsuario() { return emailUsuario; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getStatus() { return status; }
    public String getLocal() { return local; }
    public String getTipoConsulta() { return tipoConsulta; }
    public String getTelefone() { return telefone; }
    public Long getPacienteId() { return pacienteId; }

    // SETTERS
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public void setExame(String exame) { this.exame = exame; }
    public void setMedico(String medico) { this.medico = medico; }
    public void setData(String data) { this.data = data; }
    public void setHora(String hora) { this.hora = hora; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public void setStatus(String status) { this.status = status; }
    public void setLocal(String local) { this.local = local; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
}