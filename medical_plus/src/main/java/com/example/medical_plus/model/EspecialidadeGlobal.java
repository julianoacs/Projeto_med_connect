package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "especialidades_globais")
public class EspecialidadeGlobal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String nome;

    public EspecialidadeGlobal() {}
    public EspecialidadeGlobal(String nome) { this.nome = nome; }

    public Long getId() { return id; }
    public String getNome() { return nome; }
}
