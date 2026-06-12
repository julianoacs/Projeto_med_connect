package com.example.medical_plus.model;

import com.example.medical_plus.model.Usuario;
import jakarta.persistence.*;
import java.time.LocalDateTime;
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
    private String fotoPerfil;
    private String plano;
    private String city;
    private String phone;
    private LocalDateTime ultimoAcesso;
    private String status = "PENDENTE";
    
    @Column(name = "acesso")
    private String acesso = "OFFLINE";

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
        this.nome = nome; 
        this.email = email; 
        this.senha = senha; 
        this.tipo = tipo;
    }

    public Usuario(String nome, String email, String senha, String tipo, String cpf, String dataNascimento) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }

    public Usuario(String nome, String email, String senha, String tipo, String cpf, String dataNascimento, String phone, String city) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.phone = phone;
        this.city = city;
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
    public String getFotoPerfil() { return fotoPerfil; }
    public String getPlano() { return plano; }
    public String getCity() { return city; }
    public String getCelular() { return phone; }
    public LocalDateTime getUltimoAcesso() { return ultimoAcesso; }
    public String getStatus() { return status; }
    public List<String> getExames() { return exames; }
    public List<Documento> getDocumentos() { return documentos; }
    public List<LocalAtendimento> getLocaisAtendimento() { return locaisAtendimento; }
    public String getAcesso() { return acesso; }
    
    // SETTERS
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setSenha(String senha) { this.senha = senha; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public void setDataNascimento(String d) { this.dataNascimento = d; }
    public void setEspecialidade(String e) { this.especialidade = e; }
    public void setTipoRegistro(String t) { this.tipoRegistro = t; }
    public void setNumeroRegistro(String n) { this.numeroRegistro = n; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setCelular(String celular) { this.phone = celular; }
    public void setCity(String city) { this.city = city; }
    public void setPlano(String plano) { this.plano = plano; }
    public void setUltimoAcesso(LocalDateTime ultimoAcesso) { this.ultimoAcesso = ultimoAcesso; }
    public void setStatus(String s) { this.status = s; }
    public void setAcesso(String acesso) { this.acesso = acesso; }



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