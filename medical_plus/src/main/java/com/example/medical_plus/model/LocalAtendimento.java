package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locais_atendimento")
public class LocalAtendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;

    public LocalAtendimento() {}

    public LocalAtendimento(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEndereco() { return endereco; }
    public void setNome(String nome) { this.nome = nome; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
}