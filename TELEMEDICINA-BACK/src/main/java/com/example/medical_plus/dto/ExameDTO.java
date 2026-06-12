package com.example.medical_plus.dto;

public class ExameDTO {

    private String nomeExame;
    private String nomeMedico;

    public ExameDTO(String nomeExame, String nomeMedico) {
        this.nomeExame = nomeExame;
        this.nomeMedico = nomeMedico;
    }

    public String getNomeExame() {
        return nomeExame;
    }

    public String getNomeMedico() {
        return nomeMedico;
    }
}