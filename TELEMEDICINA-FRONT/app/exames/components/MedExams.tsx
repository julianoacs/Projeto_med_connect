"use client"

import { useState } from "react"
import { API_BASE_URL } from "@/app/lib/auth"

import "./MedExams.css"
import "./MedExamsL.css"
import "./MedExamsR.css"

    type ExamsG = {
        id: number
        nome: string
        descricao: string
        categoria: string
        tipo: string
        ativo: boolean
    }

    type ConsultaMinha = {
        id: number
        pacienteId: number
        medicoId: number
        medicoNome: string
        pacienteNome: string
        pacienteEmail: string
        especialidade: string
        motivo: string
        data: string
        hora: string
        tipoConsulta: string
        local: string
        status: string
    }

    type ExameEnviado = {
        id: number
        pacienteId: number
        medicoId: number
        consultaId: number
        exameGlobalId: number
        nome: string
        descricao: string
        categoria: string
        tipo: string
        arquivoNome: string
        arquivoPath: string
        arquivoTipo: string
        status: string
        criadoEm: string
    }

    type MedExamsProps = {
        consultas: ConsultaMinha[]
        selectedConsulta: ConsultaMinha | null
        loadingConsultas: boolean

        searchTerm: string
        examesEncontrados: ExamsG[]
        selectedExam: ExamsG | null
        loadingExames: boolean
        erroExames: string

        examesDaConsulta: ExameEnviado[]
        loadingExamesConsulta: boolean

        onSelectConsulta: (consulta: ConsultaMinha) => void
        onSearchTermChange: (value: string) => void
        onSelectExam: (exame: ExamsG) => void
        onRequestExam: () => void
    }

    export default function MedExams({
        consultas,
        selectedConsulta,
        loadingConsultas,

        searchTerm,
        examesEncontrados,
        selectedExam,
        loadingExames,
        erroExames,

        examesDaConsulta,
        loadingExamesConsulta,

        onSelectConsulta,
        onSelectExam,
        onRequestExam,
    }: MedExamsProps) {
    const [doctorExamTab, setDoctorExamTab] = useState<"pedir" | "recebidos">("pedir")

    const canRequestExam = Boolean(selectedConsulta && selectedExam)

    function getArquivoUrl(path?: string) {
        if (!path) return "#"

        if (path.startsWith("http")) {
            return path
        }

        return `${API_BASE_URL}${path}`
    }

    return (
        <section className="exm-med-panel">
            <div className="exm-med-tabs">
                <button
                    type="button"
                    className={`exm-med-tab-request ${
                        doctorExamTab === "pedir" ? "exm-med-tab-active" : ""
                    }`}
                    onClick={() => setDoctorExamTab("pedir")}>
                
                    PEDIR EXAMES
                </button>

                <button
                    type="button"
                    className={`exm-med-tab-received ${
                        doctorExamTab === "recebidos" ? "exm-med-tab-active" : ""
                    }`}
                    onClick={() => setDoctorExamTab("recebidos")}>
                
                    EXAMES RECEBIDOS
                </button>
            </div>

            {doctorExamTab === "pedir" && (
                <section className="exm-med-request-section">
                    <div className="exm-med-request-left">
                        <div className="exm-med-card-header">
                            <div>
                                <h3>Consulta em análise</h3>
                                <p>Escolha o paciente e a consulta antes de solicitar um exame.</p>
                            </div>

                            <span className="exm-med-pill">CONSULTAS</span>
                        </div>

                        <div className="exm-med-consultas-list">
                            {loadingConsultas ? (
                                <div className="exm-med-empty-state">
                                    Carregando consultas...
                                </div>
                            ) : consultas.length > 0 ? (
                                consultas.map((consulta) => (
                                    <button
                                        key={consulta.id}
                                        type="button"
                                        className={`exm-med-consulta-card ${
                                            selectedConsulta?.id === consulta.id
                                                ? "exm-med-consulta-card-active"
                                                : ""
                                        }`}
                                        onClick={() => onSelectConsulta(consulta)}>
                                    
                                        <div className="exm-med-consulta-avatar">
                                            {(consulta.pacienteNome || "P").charAt(0).toUpperCase()}
                                        </div>

                                        <div className="exm-med-consulta-main">
                                            <strong>{consulta.pacienteNome}</strong>

                                            <span>
                                                {consulta.motivo ||
                                                    consulta.especialidade ||
                                                    "Consulta"}
                                            </span>
                                        </div>

                                        <div className="exm-med-consulta-meta">
                                            <strong>{consulta.hora?.slice(0, 5)}</strong>
                                            <span>{consulta.data}</span>
                                        </div>

                                        <span className="exm-med-consulta-arrow">›</span>
                                    </button>
                                ))
                            ) : (
                                <div className="exm-med-empty-state">
                                    Nenhuma consulta confirmada encontrada.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="exm-med-request-right">
                        <div className="exm-med-selected-card">
                            <div className="exm-med-card-header">
                                <div>
                                    <h3>Exame para solicitar</h3>
                                    <p>Use a busca superior e selecione o exame que será pedido.</p>
                                </div>

                                <span className="exm-med-pill">EXAME</span>
                            </div>

                            <div className="exm-med-exam-list">
                                {loadingExames && (
                                    <div className="exm-med-empty-state">
                                        Buscando exames...
                                    </div>
                                )}

                                {erroExames && (
                                    <div className="exm-med-empty-state exm-med-error-state">
                                        {erroExames}
                                    </div>
                                )}

                                {!loadingExames &&
                                    !erroExames &&
                                    searchTerm.trim().length < 2 && (
                                        <div className="exm-med-empty-state">
                                            Busque um exame na barra superior para começar.
                                        </div>
                                    )}

                                {!loadingExames &&
                                    !erroExames &&
                                    searchTerm.trim().length >= 2 &&
                                    examesEncontrados.length === 0 && (
                                        <div className="exm-med-empty-state">
                                            Nenhum exame encontrado.
                                        </div>
                                    )}

                                {!loadingExames &&
                                    !erroExames &&
                                    examesEncontrados.length > 0 &&
                                    examesEncontrados.map((exame) => (
                                        <button
                                            key={exame.id}
                                            type="button"
                                            className={`exm-med-exam-card ${
                                                selectedExam?.id === exame.id
                                                    ? "exm-med-exam-card-active"
                                                    : ""
                                            }`}
                                            onClick={() => onSelectExam(exame)}>
                                        
                                            <div className="exm-med-exam-icon">
                                                <span>🧪</span>
                                            </div>

                                            <div className="exm-med-exam-main">
                                                <strong>{exame.nome}</strong>
                                                <span>{exame.categoria}</span>
                                            </div>

                                            <div className="exm-med-exam-meta">
                                                <span>Selecionar</span>
                                            </div>

                                            <span className="exm-med-exam-arrow">›</span>
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="exm-med-action-card">
                            <div className="exm-med-card-header">
                                <div>
                                    <h3>Resumo do pedido</h3>
                                    <p>Confira paciente e exame antes de enviar a solicitação.</p>
                                </div>

                                <span className="exm-med-pill exm-med-pill-action">
                                    PEDIDO
                                </span>
                            </div>

                            <div className="exm-med-request-summary">
                                <div>
                                    <small>Paciente</small>
                                    <strong>
                                        {selectedConsulta?.pacienteNome ||
                                            "Nenhuma consulta selecionada"}
                                    </strong>
                                </div>

                                <div>
                                    <small>Consulta</small>
                                    <span>
                                        {selectedConsulta
                                            ? `${selectedConsulta.data} às ${selectedConsulta.hora?.slice(0, 5)}`
                                            : "Selecione uma consulta"}
                                    </span>
                                </div>

                                <div>
                                    <small>Exame</small>
                                    <strong>
                                        {selectedExam?.nome || "Nenhum exame selecionado"}
                                    </strong>
                                </div>

                                <div>
                                    <small>Tipo</small>
                                    <span>
                                        {selectedExam
                                            ? `${selectedExam.categoria} • ${selectedExam.tipo}`
                                            : "Selecione um exame"}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`exm-med-request-button ${
                                    !canRequestExam ? "exm-med-request-disabled" : ""
                                }`}
                                disabled={!canRequestExam}
                                onClick={onRequestExam}>
                            
                                PEDIR EXAME
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {doctorExamTab === "recebidos" && (
                <section className="exm-med-received-section">
                    <div className="exm-med-received-left">
                        <div className="exm-med-card-header">
                            <div>
                                <h3>Consulta em análise</h3>
                                <p>Selecione uma consulta para visualizar os exames enviados.</p>
                            </div>

                            <span className="exm-med-pill">CONSULTAS</span>
                        </div>

                        <div className="exm-med-consultas-list">
                            {loadingConsultas ? (
                                <div className="exm-med-empty-state">
                                    Carregando consultas...
                                </div>
                            ) : consultas.length > 0 ? (
                                consultas.map((consulta) => (
                                    <button
                                        key={consulta.id}
                                        type="button"
                                        className={`exm-med-consulta-card ${
                                            selectedConsulta?.id === consulta.id
                                                ? "exm-med-consulta-card-active"
                                                : ""
                                        }`}
                                        onClick={() => onSelectConsulta(consulta)}>
                                    
                                        <div className="exm-med-consulta-avatar">
                                            {(consulta.pacienteNome || "P").charAt(0).toUpperCase()}
                                        </div>

                                        <div className="exm-med-consulta-main">
                                            <strong>{consulta.pacienteNome}</strong>

                                            <span>
                                                {consulta.motivo ||
                                                    consulta.especialidade ||
                                                    "Consulta"}
                                            </span>
                                        </div>

                                        <div className="exm-med-consulta-meta">
                                            <strong>{consulta.hora?.slice(0, 5)}</strong>
                                            <span>{consulta.data}</span>
                                        </div>

                                        <span className="exm-med-consulta-arrow">›</span>
                                    </button>
                                ))
                            ) : (
                                <div className="exm-med-empty-state">
                                    Nenhuma consulta confirmada encontrada.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="exm-med-received-right">
                        <div className="exm-med-card-header">
                            <div>
                                <h3>Exames recebidos</h3>
                                <p>Resultados enviados pelo paciente para a consulta selecionada.</p>
                            </div>

                            <span className="exm-med-pill">RECEBIDOS</span>
                        </div>

                        <div className="exm-med-received-list">
                            {!selectedConsulta ? (
                                <div className="exm-med-empty-state">
                                    Selecione uma consulta para ver os exames recebidos.
                                </div>
                            ) : loadingExamesConsulta ? (
                                <div className="exm-med-empty-state">
                                    Carregando exames...
                                </div>
                            ) : examesDaConsulta.length > 0 ? (
                                examesDaConsulta.map((exame) => (
                                    <div
                                        key={exame.id}
                                        className="exm-med-received-card">
                                    
                                        <div className="exm-med-received-icon">
                                            <span>📄</span>
                                        </div>

                                        <div className="exm-med-received-main">
                                            <strong>{exame.nome}</strong>

                                            <span>
                                                {exame.categoria} • {exame.status}
                                            </span>

                                            <small>
                                                {exame.arquivoNome || "Arquivo sem nome"}
                                            </small>
                                        </div>

                                        {exame.arquivoPath && (
                                        <a
                                            href={getArquivoUrl(exame.arquivoPath)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="exm-med-open-file">
                                            
                                            ABRIR
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="exm-med-empty-state">
                                    Nenhum exame recebido nessa consulta ainda.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </section>
    )
}