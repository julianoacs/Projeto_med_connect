package com.example.medical_plus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Long id;

    private Long usuarioId;

    private String tipo;

    private String titulo;

    private String mensagem;

    private String rotaDestino;

    private boolean lida = false;

    private LocalDateTime criadoEm = LocalDateTime.now();

    public Notifications() {
    }

    public Notifications(
            Long usuarioId,
            String tipo,
            String titulo,
            String mensagem,
            String rotaDestino
    ) {
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.rotaDestino = rotaDestino;
        this.lida = false;
        this.criadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getRotaDestino() {
        return rotaDestino;
    }

    public void setRotaDestino(String rotaDestino) {
        this.rotaDestino = rotaDestino;
    }

    public boolean isLida() {
        return lida;
    }

    public void setLida(boolean lida) {
        this.lida = lida;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}