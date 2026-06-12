package com.example.medical_plus.model;

import java.util.List;

public class Profile {

    public static class ProfileResponse {
        private boolean success;
        private String message;
        private ProfileInfo info;
        private List<ProfileHistoricItem> historic;
        private List<ProfileExamItem> exams;

        public ProfileResponse() {}

        public ProfileResponse(
                boolean success,
                String message,
                ProfileInfo info,
                List<ProfileHistoricItem> historic,
                List<ProfileExamItem> exams
        ) {
            this.success = success;
            this.message = message;
            this.info = info;
            this.historic = historic;
            this.exams = exams;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public ProfileInfo getInfo() { return info; }
        public List<ProfileHistoricItem> getHistoric() { return historic; }
        public List<ProfileExamItem> getExams() { return exams; }

        public void setSuccess(boolean success) { this.success = success; }
        public void setMessage(String message) { this.message = message; }
        public void setInfo(ProfileInfo info) { this.info = info; }
        public void setHistoric(List<ProfileHistoricItem> historic) { this.historic = historic; }
        public void setExams(List<ProfileExamItem> exams) { this.exams = exams; }
    }

    public static class ProfileInfo {
        private String nome;
        private String email;
        private String tipo;
        private String cpf;
        private String dataNascimento;
        private String avatar;

        public ProfileInfo() {}

        public ProfileInfo(
                String nome,
                String email,
                String tipo,
                String cpf,
                String dataNascimento,
                String avatar
        ) {
            this.nome = nome;
            this.email = email;
            this.tipo = tipo;
            this.cpf = cpf;
            this.dataNascimento = dataNascimento;
            this.avatar = avatar;
        }

        public String getNome() { return nome; }
        public String getEmail() { return email; }
        public String getTipo() { return tipo; }
        public String getCpf() { return cpf; }
        public String getDataNascimento() { return dataNascimento; }
        public String getAvatar() { return avatar; }

        public void setNome(String nome) { this.nome = nome; }
        public void setEmail(String email) { this.email = email; }
        public void setTipo(String tipo) { this.tipo = tipo; }
        public void setCpf(String cpf) { this.cpf = cpf; }
        public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
    }

    public static class ProfileHistoricItem {
        private String data;
        private String medico;
        private String especialidade;
        private String diagnostico;
        private String receita;
        private String observacoes;

        public ProfileHistoricItem() {}

        public ProfileHistoricItem(
                String data,
                String medico,
                String especialidade,
                String diagnostico,
                String receita,
                String observacoes
        ) {
            this.data = data;
            this.medico = medico;
            this.especialidade = especialidade;
            this.diagnostico = diagnostico;
            this.receita = receita;
            this.observacoes = observacoes;
        }

        public String getData() { return data; }
        public String getMedico() { return medico; }
        public String getEspecialidade() { return especialidade; }
        public String getDiagnostico() { return diagnostico; }
        public String getReceita() { return receita; }
        public String getObservacoes() { return observacoes; }

        public void setData(String data) { this.data = data; }
        public void setMedico(String medico) { this.medico = medico; }
        public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
        public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }
        public void setReceita(String receita) { this.receita = receita; }
        public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    }

    public static class ProfileExamItem {
        private String exams;
        private String date;
        private String requests;
        private String results;
        private String archive;

        public ProfileExamItem() {}

        public ProfileExamItem(
                String exams,
                String date,
                String requests,
                String results,
                String archive
        ) {
            this.exams = exams;
            this.date = date;
            this.requests = requests;
            this.results = results;
            this.archive = archive;
        }

        public String getExams() { return exams; }
        public String getDate() { return date; }
        public String getRequests() { return requests; }
        public String getResults() { return results; }
        public String getArchive() { return archive; }

        public void setExams(String exams) { this.exams = exams; }
        public void setDate(String date) { this.date = date; }
        public void setRequests(String requests) { this.requests = requests; }
        public void setResults(String results) { this.results = results; }
        public void setArchive(String archive) { this.archive = archive; }
    }
}