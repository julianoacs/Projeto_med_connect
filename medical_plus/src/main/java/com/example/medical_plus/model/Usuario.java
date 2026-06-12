package com.example.medical_plus.model;

import com.example.medical_plus.model.LocalAtendimento;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;
    private String tipo;
    private String cpf;
    private String dataNascimento;
    private String especialidade;
    private String tipoRegistro;
    private String numeroRegistro;
    private String status = "PENDENTE";

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_exames", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "exame")
    private List<String> exames = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "usuario_id")
    private List<Documento> documentos = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "usuario_id")
    private List<LocalAtendimento> locaisAtendimento = new ArrayList<>();

    public Usuario() {}

    public Usuario(String nome, String email, String senha, String tipo) {
        this.nome = nome; this.email = email; this.senha = senha; this.tipo = tipo;
    }

    public Usuario(String nome, String email, String senha, String tipo, String cpf, String dataNascimento) {
        this.nome = nome; this.email = email; this.senha = senha; this.tipo = tipo;
        this.cpf = cpf; this.dataNascimento = dataNascimento;
    }

    // GETTERS
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getSenha() { return senha; }
    public String getTipo() { return tipo; }
    public String getCpf() { return cpf; }
    public String getDataNascimento() { return dataNascimento; }
    public String getEspecialidade() { return especialidade; }
    public String getTipoRegistro() { return tipoRegistro; }
    public String getNumeroRegistro() { return numeroRegistro; }
    public String getStatus() { return status; }
    public List<String> getExames() { return exames; }
    public List<Documento> getDocumentos() { return documentos; }
    public List<LocalAtendimento> getLocaisAtendimento() { return locaisAtendimento; }

    // SETTERS
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setSenha(String senha) { this.senha = senha; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public void setDataNascimento(String d) { this.dataNascimento = d; }
    public void setEspecialidade(String e) { this.especialidade = e; }
    public void setTipoRegistro(String t) { this.tipoRegistro = t; }
    public void setNumeroRegistro(String n) { this.numeroRegistro = n; }
    public void setStatus(String s) { this.status = s; }

    // NEGÓCIO
    public void adicionarExame(String exame) {
        if (exame == null || exame.trim().isEmpty()) return;
        if (exames.stream().noneMatch(e -> e.equalsIgnoreCase(exame))) exames.add(exame);
    }

    public void removerExame(String exame) {
        exames.removeIf(e -> e.equalsIgnoreCase(exame));
    }

    public void adicionarDocumento(String nomeArquivo) {
        documentos.add(new Documento(nomeArquivo));
    }

    public void removerDocumento(String nomeArquivo) {
        documentos.removeIf(d -> d.getNomeArquivo().equals(nomeArquivo));
    }

    public void adicionarLocal(String nome, String endereco) {
        locaisAtendimento.add(new LocalAtendimento(nome, endereco));
    }

    public void removerLocal(Long id) {
        locaisAtendimento.removeIf(l -> l.getId().equals(id));
    }

    public void definirEspecialidade(String especialidade) {
        if (especialidade != null && !especialidade.trim().isEmpty()) this.especialidade = especialidade;
    }
}