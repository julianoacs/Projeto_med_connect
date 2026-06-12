"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
    getConsultaRoomContexto,
    type ConsultaRoomContexto,
} from "@/app/lib/auth"

import "./background.css"
import "./laudo.css"

export default function LaudoPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const consultaId = searchParams.get("id")

    const [contexto, setContexto] = useState<ConsultaRoomContexto | null>(null)
    const [loadingLaudo, setLoadingLaudo] = useState(true)
    const [erroLaudo, setErroLaudo] = useState("")

    useEffect(() => {
        async function loadLaudo() {
            if (!consultaId) {
                setErroLaudo("Consulta não informada.")
                setLoadingLaudo(false)
                return
            }

            try {
                const data = await getConsultaRoomContexto(Number(consultaId))

                console.log("LAUDO CONTEXTO:", data)

                if (!data.success) {
                    setErroLaudo(data.message || "Não foi possível carregar o laudo.")
                    setLoadingLaudo(false)
                    return
                }

                setContexto(data.contexto)
            } catch (error) {
                console.log("ERRO AO CARREGAR LAUDO:", error)
                setErroLaudo("Erro ao conectar com o servidor.")
            } finally {
                setLoadingLaudo(false)
            }
        }

        loadLaudo()
    }, [consultaId])

    function formatDate(value?: string | null) {
        if (!value) return "Não informado"

        const parts = value.split("-")

        if (parts.length !== 3) return value

        return `${parts[2]}/${parts[1]}/${parts[0]}`
    }

    function formatHour(value?: string | null) {
        if (!value) return "Não informado"

        return value.slice(0, 5)
    }

    function getMedicoRegistro() {
        if (!contexto) return "Registro não informado"

        return (
            contexto.consulta.medicoNumeroRegistro ||
            "Registro não informado"
        )
    }

    function getLaudoTexto() {
        if (!contexto) return ""

        const notas = contexto.room.notasMedicas?.trim()
        const observacoes = contexto.room.observacoes?.trim()
        const conduta = contexto.room.conduta?.trim()

        const partes = [
            notas,
            observacoes,
            conduta,
        ].filter(Boolean)

        if (partes.length === 0) {
            return "Nenhum laudo médico foi registrado para esta consulta."
        }

        return partes.join("\n\n")
    }

    function getPrescricaoTexto() {
        if (!contexto) return ""

        return (
            contexto.room.medicamentos?.trim() ||
            "Nenhuma prescrição médica foi registrada para esta consulta."
        )
    }

    function calcularIdadeMeiaBoca(dataNascimento?: string | null) {
        if (!dataNascimento) return null

        const ano = Number(dataNascimento.slice(0, 4))

        if (!ano || Number.isNaN(ano)) return null

        return 2026 - ano
    }

    const paciente = contexto?.paciente
    const consulta = contexto?.consulta

    const idadePaciente =
        paciente?.idade ||
        calcularIdadeMeiaBoca(paciente?.dataNascimento)

    const medicoRegistro = getMedicoRegistro()
    const laudoTexto = getLaudoTexto()
    const prescricaoTexto = getPrescricaoTexto()

    const hasError = Boolean(erroLaudo || !contexto)

    return (
        <main className="laudo-page">
            {loadingLaudo ? (
                <div className="laudo-loading">
                    Carregando laudo médico...
                </div>
            ) : hasError ? (
                <div className="laudo-loading">
                    <strong>Não foi possível abrir o laudo.</strong>
                    <span>{erroLaudo || "Consulta não encontrada."}</span>

                    <button
                        type="button"
                        onClick={() => router.back()}>
                    
                        Voltar
                    </button>
                </div>
            ) : (
                <div className="laudo-paper">
                    <div className="laudo-watermark">
                        <img
                            src="/images/laudo/telemed.png"
                            alt=""
                            className="laudo-watermark-img"/>
                        

                        <strong>MED CONNECT</strong>
                    </div>

                    <div className="laudo-line"/>

                    <header className="laudo-header-info">
                        <div className="laudo-doctor-box">
                            <div className="laudo-icon-circle">
                                <span>♙</span>
                            </div>

                            <div>
                                <h2>{consulta?.medicoNome || "Médico não informado"}</h2>
                                <p>{medicoRegistro}</p>
                                <span>
                                    {consulta?.especialidade || "Especialidade não informada"}
                                </span>
                            </div>
                        </div>

                        <div className="laudo-divider" />

                        <div className="laudo-patient-box">
                            <div className="laudo-icon-circle">
                                <span>♙</span>
                            </div>

                            <div>
                                <p>
                                    <strong>Paciente:</strong>{" "}
                                    {paciente?.nome || consulta?.pacienteNome || "Não informado"}
                                </p>

                                <p>
                                    <strong>Idade:</strong>{" "}
                                    {idadePaciente? `${idadePaciente} anos` : "Idade não informada"}
                                </p>

                                <p>
                                    <strong>Data:</strong>{" "}
                                    {formatDate(consulta?.data)}
                                </p>

                                <p>
                                    <strong>Horário:</strong>{" "}
                                    {formatHour(consulta?.hora)}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="laudo-line" />

                    <div className="laudo-title">
                        <span />
                        <h1>LAUDO MÉDICO</h1>
                        <span />
                    </div>

                    <div className="laudo-content">
                        <p>{laudoTexto}</p>
                    </div>

                    <div className="laudo-title laudo-prescription-title">
                        <span />
                        <h1>PRESCRIÇÃO MÉDICA</h1>
                        <span />
                    </div>

                    <div className="laudo-prescription">
                        <p>{prescricaoTexto}</p>
                    </div>

                    <footer className="laudo-signature">
                        <div className="laudo-signature-name">
                            {consulta?.medicoNome || "Médico responsável"}
                        </div>

                        <div className="laudo-signature-line" />

                        <strong>{consulta?.medicoNome || "Médico responsável"}</strong>
                        <span>{medicoRegistro}</span>
                    </footer>
                </div>
            )}
        </main>
    )
}