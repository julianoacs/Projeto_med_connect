package com.example.medical_plus.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalTime hora;

    @Column(nullable = false)
    private Boolean ativo = true;

    public Horario() {
    }

    public Horario(LocalTime hora, Boolean ativo) {
        this.hora = hora;
        this.ativo = ativo;
    }

    public Long getId() {
        return id;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}