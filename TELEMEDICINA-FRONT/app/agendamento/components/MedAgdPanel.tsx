"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


import { API_BASE_URL } from "@/app/lib/auth"

import "./medii.css"
import "./mediiL.css"
import "./mediiR.css"
import "./mymedii.css"
import './medexams.css'


type MedAgendamentoPanelProps = {
    doctorTab: "next" | "my"
    setDoctorTab: React.Dispatch<React.SetStateAction<"next" | "my">>
}

type MedAgendamento = {
    id: number
    exame: string
    medico: string
    data: string
    hora: string
    emailUsuario: string
    nomeUsuario: string
    status: string
    local: string
    tipoConsulta: string
    telefone: string
    especialidade?: string
}

type MedConsulta = {
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

export default function MedAgendamentoPanel({
    doctorTab,
    setDoctorTab,
}: MedAgendamentoPanelProps) {

    const router = useRouter()

    const [medAgendamentos, setMedAgendamentos] = useState<MedAgendamento[]>([])
    const [loadingMedAgd, setLoadingMedAgd] = useState(false)
    const [selectedMedAgd, setSelectedMedAgd] = useState<MedAgendamento | null>(null)
    const [medActionLoading, setMedActionLoading] = useState(false)
    const [medActionError, setMedActionError] = useState("")
    const [medConsultas, setMedConsultas] = useState<MedConsulta[]>([])
    const [loadingMedConsultas, setLoadingMedConsultas] = useState(false)
    const [selectedMedConsulta, setSelectedMedConsulta] = useState<MedConsulta | null>(null)

    useEffect(() => {
        async function loadMedAgendamentos() {
            if (doctorTab !== "next") return

            setLoadingMedAgd(true)

            const response = await fetch(`${API_BASE_URL}/api/medico/agendamentos`, {
                credentials: "include",
            })

            const data = await response.json()

            setLoadingMedAgd(false)

            if (!data.success) {
                console.log(data.message)
                setMedAgendamentos([])
                setSelectedMedAgd(null)
                return
            }

            const agendamentos = data.agendamentos || []

            setMedAgendamentos(agendamentos)

            if (agendamentos.length > 0) {
                setSelectedMedAgd((current) => current ?? agendamentos[0])
            } else {
                setSelectedMedAgd(null)
            }
        }

        loadMedAgendamentos()
    }, [doctorTab])

    
    async function handleMedAgdAction(id: number, action: "aceitar" | "recusar") {
        if (medActionLoading) return

        setMedActionLoading(true)
        setMedActionError("")

        console.log("CLIQUE ACTION:", id, action)

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/medico/agendamentos/${id}/${action}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            )

            console.log("STATUS ACTION:", response.status)

            const text = await response.text()

            let data: {
                success?: boolean
                message?: string
            } | null = null

            try {
                data = text ? JSON.parse(text) : null
            } catch {
                console.log("RESPOSTA BRUTA DO BACKEND:", text)
            }

            console.log("MED AGD ACTION:", data || text)

            if (!response.ok || !data?.success) {
                const cleanMessage =
                    data?.message ||
                    (action === "aceitar"
                        ? "Não foi possível aceitar o agendamento agora."
                        : "Não foi possível recusar o agendamento agora.")

                setMedActionError(cleanMessage)
                return
            }

            const novaLista = medAgendamentos.filter((agd) => agd.id !== id)

            setMedAgendamentos(novaLista)
            setSelectedMedAgd(novaLista[0] || null)

            setMedActionError("")
        } catch (error) {
            console.log("ERRO NO FETCH DO BOTÃO:", error)
            setMedActionError("Não foi possível conectar ao servidor.")
        } finally {
            setMedActionLoading(false)
        }
    }

    useEffect(() => {
        async function loadMedConsultas() {
            if (doctorTab !== "my") return

            setLoadingMedConsultas(true)

            try {
                const response = await fetch(`${API_BASE_URL}/api/consultas/minhas`, {
                    credentials: "include",
                })

                const data = await response.json()

                console.log("MED CONSULTAS:", data)

                if (!data.success) {
                    console.log(data.message)
                    setMedConsultas([])
                    setSelectedMedConsulta(null)
                    return
                }

                const consultas = data.consultas || []

                setMedConsultas(consultas)

                if (consultas.length > 0) {
                    setSelectedMedConsulta((current) => current ?? consultas[0])
                } else {
                    setSelectedMedConsulta(null)
                }
            } catch (error) {
                console.log("ERRO AO BUSCAR CONSULTAS:", error)
                setMedConsultas([])
                setSelectedMedConsulta(null)
            } finally {
                setLoadingMedConsultas(false)
            }
        }

        loadMedConsultas()
    }, [doctorTab])


    return (
        <div className="agd-doctor-panel">
            <div className="agd-tabs">
                <button
                    type="button"
                    className={`agd-tab-next ${doctorTab === "next" ? "agd-tab-active" : ""}`}
                    onClick={() => setDoctorTab("next")}>

                    NOVOS AGENDAMENTOS
                </button>

                <button
                    type="button"
                    className={`agd-tab-my ${doctorTab === "my" ? "agd-tab-active" : ""}`}
                    onClick={() => setDoctorTab("my")}>

                    MEUS AGENDAMENTOS
                </button>
            </div>

            {doctorTab === "next" && (
                <section className="med-agd-shell">
                    <div className="med-agd-left">
                        <div className="med-agd-request-list">

                            {loadingMedAgd ? (
                                <div className="med-agd-empty">
                                    Carregando solicitações...
                                </div>
                            ) : medAgendamentos.length > 0 ? (
                                medAgendamentos.map((agd) => (

                                    <button
                                        key={agd.id}
                                        type="button"
                                        className={`med-agd-request-card ${
                                            selectedMedAgd?.id === agd.id ? "med-agd-request-active" : ""
                                        }`}
                                        onClick={() => setSelectedMedAgd(agd)}>
                                    
                                        <div className="med-agd-request-top">
                                            <strong>{agd.nomeUsuario}</strong>
                                            <span>{agd.hora?.slice(0, 5)}</span>
                                        </div>

                                        <p>{agd.exame}</p>

                                        <div className="med-agd-request-bottom">
                                            <span>{agd.data}</span>
                                            <small>{agd.status}</small>
                                        </div>
                                    </button>

                                ))
                            ) : (
                                <div className="med-agd-empty">
                                    Nenhuma solicitação pendente.
                                </div>
                            )}
                            
                        </div>
                    </div>

                    <div className="med-agd-right">
                        {selectedMedAgd ? (
                            <div className="med-right-container">

                                <div className="med-agd-detail-header">
                                    <div className="med-agd-detail-title">
                                        <h3>Pedido de agendamento</h3>
                                        <p>Revise a solicitação antes de aceitar ou recusar.</p>
                                    </div>

                                    <span className="med-agd-detail-badge">
                                        {selectedMedAgd.status}
                                    </span>
                                </div>

                                <div className="med-agd-detail-card">
                                    <h4>Paciente</h4>

                                    <div className="med-agd-detail-row">
                                        <span>Nome</span>
                                        <strong>{selectedMedAgd.nomeUsuario}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Email</span>
                                        <strong>{selectedMedAgd.emailUsuario}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Telefone</span>
                                        <strong>{selectedMedAgd.telefone || "Não informado"}</strong>
                                    </div>
                                </div>

                                <div className="med-agd-detail-card">
                                    <h4>Consulta</h4>

                                    <div className="med-agd-detail-row">
                                        <span>Especialidade</span>
                                        <strong>{selectedMedAgd.especialidade || "Não informada"}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Motivo</span>
                                        <strong>{selectedMedAgd.exame}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Data</span>
                                        <strong>{selectedMedAgd.data}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Horário</span>
                                        <strong>{selectedMedAgd.hora?.slice(0, 5)}</strong>
                                    </div>

                                    <div className="med-agd-detail-row">
                                        <span>Tipo</span>
                                        <strong>{selectedMedAgd.tipoConsulta || "ONLINE"}</strong>
                                    </div>
                                </div>

                                <div className="med-agd-actions">

                                    <button
                                        type="button"
                                        className="med-agd-refuse-button"
                                        onClick={() => handleMedAgdAction(selectedMedAgd.id, "recusar")}>
                                        RECUSAR
                                    </button>

                                    <button
                                        type="button"
                                        className="med-agd-accept-button"
                                        onClick={() => handleMedAgdAction(selectedMedAgd.id, "aceitar")}>
                                        ACEITAR
                                    </button>

                                </div>
                            </div>
                        ) : (
                            <div className="med-agd-empty-detail">
                                Selecione uma solicitação para ver os detalhes.
                            </div>
                        )}
                    </div>

                </section>
            )}


            {doctorTab === "my" && (
                <section className="my-med-agd-section">
                    <div className="my-med-agd-header">
                        <h3>Meus agendamentos</h3>
                        <p>Consultas confirmadas e organizadas na sua agenda.</p>
                    </div>

                    <div className="my-med-agd-list">
                        {loadingMedConsultas ? (
                            <div className="my-med-agd-empty">
                                Carregando agendamentos...
                            </div>
                        ) : medConsultas.length > 0 ? (
                            medConsultas.map((consulta) => (
                                <button
                                    key={consulta.id}
                                    type="button"
                                    className="my-med-agd-card"
                                    onClick={() => router.push(`/consultas?id=${consulta.id}`)}>

                                    <div className="my-med-agd-main">
                                        <div className="my-med-agd-title">
                                            <strong>{consulta.pacienteNome}</strong>
                                            
                                        </div>

                                        <p>{consulta.motivo}</p>
                                    </div>

                                    <div className="my-med-agd-meta">
                                            <span>{consulta.status}</span>
                                        <small>
                                            {consulta.data} às {consulta.hora?.slice(0, 5)}
                                        </small>
                                    </div>

                                    <div className="my-med-agd-arrow">
                                        ›
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="my-med-agd-empty">
                                Nenhum agendamento confirmado.
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}