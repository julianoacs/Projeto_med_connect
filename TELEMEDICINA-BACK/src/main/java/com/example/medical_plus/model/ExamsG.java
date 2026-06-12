package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exames_globais")
public class ExamsG {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(length = 80)
    private String categoria;

    @Column(length = 120)
    private String tipo;

    private Boolean ativo = true;

    public ExamsG() {
    }

    public ExamsG(String nome) {
        this.nome = nome;
        this.ativo = true;
    }

    public ExamsG(String nome, String descricao, String categoria, String tipo) {
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.tipo = tipo;
        this.ativo = true;
    }

    public Long getId() {
        return id;
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

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}