package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "consultas")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "medico_id", nullable = false)
    private Long medicoId;

    private String medicoNome;

    private String pacienteNome;
    private String pacienteEmail;

    private String especialidade;
    private String motivo;

    private String data;
    private String hora;

    private String tipoConsulta;
    private String local;

    private String status = "CONFIRMADA";

    public Consulta() {}

    // GETTERS
    public Long getId() { return id; }
    public Long getPacienteId() { return pacienteId; }
    public Long getMedicoId() { return medicoId; }
    public String getMedicoNome() { return medicoNome; }
    public String getPacienteNome() { return pacienteNome; }
    public String getPacienteEmail() { return pacienteEmail; }
    public String getEspecialidade() { return especialidade; }
    public String getMotivo() { return motivo; }
    public String getData() { return data; }
    public String getHora() { return hora; }
    public String getTipoConsulta() { return tipoConsulta; }
    public String getLocal() { return local; }
    public String getStatus() { return status; }

    // SETTERS
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }
    public void setMedicoNome(String medicoNome) { this.medicoNome = medicoNome; }
    public void setPacienteNome(String pacienteNome) { this.pacienteNome = pacienteNome; }
    public void setPacienteEmail(String pacienteEmail) { this.pacienteEmail = pacienteEmail; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public void setData(String data) { this.data = data; }
    public void setHora(String hora) { this.hora = hora; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }
    public void setLocal(String local) { this.local = local; }
    public void setStatus(String status) { this.status = status; }
}