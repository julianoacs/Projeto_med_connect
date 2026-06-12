package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exames_globais")
public class ExameGlobal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String nome;

    public ExameGlobal() {}
    public ExameGlobal(String nome) { this.nome = nome; }

    public Long getId() { return id; }
    public String getNome() { return nome; }
}
