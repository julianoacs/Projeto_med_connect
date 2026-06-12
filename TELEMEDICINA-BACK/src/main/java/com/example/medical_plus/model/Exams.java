package com.example.medical_plus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exames")
public class Exams {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pacienteId;
    private Long medicoId;
    private Long consultaId;
    private Long exameGlobalId;
    private Long pedidoExameId;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private String categoria;

    private String tipo;
    private String icone;
    private String arquivoNome;
    private String arquivoPath;
    private String arquivoTipo;
    private String status = "ENVIADO";
    private Boolean ativo = true;
    private LocalDateTime criadoEm = LocalDateTime.now();

    public Exams() {
    }

    public Exams(String nome, String descricao, String categoria, String icone) {
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.icone = icone;
        this.ativo = true;
        this.status = "ENVIADO";
        this.criadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getMedicoId() {
        return medicoId;
    }

    public void setMedicoId(Long medicoId) {
        this.medicoId = medicoId;
    }

    public Long getConsultaId() {
        return consultaId;
    }

    public void setConsultaId(Long consultaId) {
        this.consultaId = consultaId;
    }

    public Long getExameGlobalId() {
        return exameGlobalId;
    }

    public void setExameGlobalId(Long exameGlobalId) {
        this.exameGlobalId = exameGlobalId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getIcone() {
        return icone;
    }

    public void setIcone(String icone) {
        this.icone = icone;
    }

    public String getArquivoNome() {
        return arquivoNome;
    }

    public void setArquivoNome(String arquivoNome) {
        this.arquivoNome = arquivoNome;
    }

    public String getArquivoPath() {
        return arquivoPath;
    }

    public void setArquivoPath(String arquivoPath) {
        this.arquivoPath = arquivoPath;
    }

    public String getArquivoTipo() {
        return arquivoTipo;
    }

    public void setArquivoTipo(String arquivoTipo) {
        this.arquivoTipo = arquivoTipo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Long getPedidoExameId() {
        return pedidoExameId;
    }

    public void setPedidoExameId(Long pedidoExameId) {
        this.pedidoExameId = pedidoExameId;
    }
}
