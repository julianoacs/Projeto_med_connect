package com.example.medical_plus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consulta_room")
public class ConsultaRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long consultaId;
    private Long pacienteId;
    private Long medicoId;

    @Column(columnDefinition = "TEXT")
    private String notasMedicas;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String conduta;

    @Column(columnDefinition = "TEXT")
    private String medicamentos;

    private String status = "EM_ANDAMENTO";

    private LocalDateTime criadoEm = LocalDateTime.now();
    private LocalDateTime atualizadoEm;

    public ConsultaRoom() {
    }

    // GETTERS
    public Long getId() { return id; }
    public Long getConsultaId() { return consultaId; }
    public Long getPacienteId() { return pacienteId; }
    public Long getMedicoId() { return medicoId; }
    public String getNotasMedicas() { return notasMedicas; }
    public String getObservacoes() { return observacoes; }
    public String getConduta() { return conduta; }
    public String getMedicamentos() { return medicamentos; }
    public String getStatus() { return status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }

    // SETTERS
    public void setConsultaId(Long consultaId) { this.consultaId = consultaId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }
    public void setNotasMedicas(String notasMedicas) { this.notasMedicas = notasMedicas; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public void setConduta(String conduta) { this.conduta = conduta; }
    public void setMedicamentos(String medicamentos) { this.medicamentos = medicamentos; }
    public void setStatus(String status) { this.status = status; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}