package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String exame;
    private String medico;
    private String data;
    private String hora;
    private String emailUsuario;
    private String nomeUsuario;
    private String status = "PENDENTE";
    private String local;
    private String tipoConsulta;
    private String telefone;

    public Agendamento() {}

    public Agendamento(String exame, String medico, String data, String hora, String emailUsuario, String nomeUsuario) {
        this.exame = exame; this.medico = medico; this.data = data;
        this.hora = hora; this.emailUsuario = emailUsuario; this.nomeUsuario = nomeUsuario;
    }

    public Long getId() { return id; }
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
    public void setStatus(String status) { this.status = status; }
    public void setLocal(String local) { this.local = local; }
    public void setTipoConsulta(String t) { this.tipoConsulta = t; }
    public void setTelefone(String t) { this.telefone = t; }
}
