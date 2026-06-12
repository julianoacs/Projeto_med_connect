package com.example.medical_plus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeArquivo;
    private String status = "PENDENTE";

    public Documento() {}

    public Documento(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
        this.status = "PENDENTE";
    }

    public Long getId() { return id; }
    public String getNomeArquivo() { return nomeArquivo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
