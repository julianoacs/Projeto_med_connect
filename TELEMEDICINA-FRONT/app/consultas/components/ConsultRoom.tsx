import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
    salvarConsultaRoom,
    finalizarConsultaRoom,
    type ConsultaMinha,
    type ConsultaRoomContexto,
} from "@/app/lib/auth"

import "./ConsultBase.css"
import "./consultMedicLeft.css"
import "./consultMedicRight.css"


type ConsultRoomProps = {
    consulta: ConsultaMinha
    contexto: ConsultaRoomContexto
}

export default function ConsultRoom({ consulta, contexto }: ConsultRoomProps) {

    const router = useRouter()

    const paciente = contexto.paciente
    const anotacoes = contexto.anotacoesOutrosMedicos || []
    const consultasAnteriores = contexto.consultasAnteriores || []

    const [salvando, setSalvando] = useState(false)
    const [finalizando, setFinalizando] = useState(false)
    const [mensagemRegistro, setMensagemRegistro] = useState("")
    const [erroRegistro, setErroRegistro] = useState("")
    const [consultaFinalizada, setConsultaFinalizada] = useState(consulta.status?.toUpperCase() === "FINALIZADA")

    const roomRegistro = contexto.room

    const [resultadoConsulta, setResultadoConsulta] = useState(
        roomRegistro?.notasMedicas || ""
    )

    const [observacoes, setObservacoes] = useState(
        roomRegistro?.observacoes || ""
    )

    const [conduta, setConduta] = useState(
        roomRegistro?.conduta || ""
    )

    const [receita, setReceita] = useState(
        roomRegistro?.medicamentos || ""
    )

    function formatDate(date?: string) {
        if (!date) {
            return "Sem data"
        }

        try {
            return new Date(date).toLocaleDateString("pt-BR")
        } catch {
            return date
        }
    }

    async function handleSalvarAnotacoes() {
        try {
            setSalvando(true)
            setMensagemRegistro("")
            setErroRegistro("")

            const data = await salvarConsultaRoom({
                consultaId: consulta.id,
                notasMedicas: resultadoConsulta,
                observacoes,
                conduta,
                medicamentos: receita,
            })

            console.log("SALVAR CONSULTA ROOM:", data)

            if (!data.success) {
                setErroRegistro(data.message || "Erro ao salvar anotações")
                return
            }

            setMensagemRegistro("Anotações salvas com sucesso.")
        } catch (error) {
            console.log("ERRO AO SALVAR ANOTAÇÕES:", error)
            setErroRegistro("Erro ao salvar anotações")
        } finally {
            setSalvando(false)
        }
    }

    async function handleFinalizarConsulta() {
        if (consultaFinalizada) {
            return
        }

        try {
            setFinalizando(true)
            setMensagemRegistro("")
            setErroRegistro("")

            const saveData = await salvarConsultaRoom({
                consultaId: consulta.id,
                notasMedicas: resultadoConsulta,
                observacoes,
                conduta,
                medicamentos: receita,
            })

            if (!saveData.success) {
                setErroRegistro(saveData.message || "Erro ao salvar antes de finalizar")
                return
            }

            const finishData = await finalizarConsultaRoom(consulta.id)

            if (!finishData.success) {
                setErroRegistro(finishData.message || "Erro ao finalizar consulta")
                return
            }

            setConsultaFinalizada(true)
            setMensagemRegistro("Consulta finalizada com sucesso.")

            setTimeout(() => {
                router.push("/consultas")
            }, 800)
        } catch (error) {
            console.log("ERRO AO FINALIZAR CONSULTA:", error)
            setErroRegistro("Erro ao finalizar consulta")
        } finally {
            setFinalizando(false)
        }
    }

    useEffect(() => {
        setResultadoConsulta(roomRegistro?.notasMedicas || "")
        setObservacoes(roomRegistro?.observacoes || "")
        setConduta(roomRegistro?.conduta || "")
        setReceita(roomRegistro?.medicamentos || "")

        setConsultaFinalizada(
            consulta.status?.toUpperCase() === "FINALIZADA" ||
            roomRegistro?.status?.toUpperCase() === "FINALIZADA"
        )
    }, [
        consulta.id,
        consulta.status,
        roomRegistro?.notasMedicas,
        roomRegistro?.observacoes,
        roomRegistro?.conduta,
        roomRegistro?.medicamentos,
        roomRegistro?.status,
    ])

  return (
    <section className="consult-medic-grid">
        <section className="consult-medic-left-section">
            <div className="consult-medic-left">
                <div className="consult-medic-left-header">
                    <div className="consult-medic-left-title">
                        <span className="consult-medic-left-icon">♙</span>
                        <h2>Contexto do paciente</h2>
                    </div>
                </div>

                <div className="consult-patient-profile">
                    <div className="consult-patient-avatar">
                        {(paciente.nome || consulta.pacienteNome || "P")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="consult-patient-profile-main">
                        <div className="consult-patient-name-row">
                            <h3>{paciente.nome || consulta.pacienteNome}</h3>

                            <span className="consult-patient-status">
                                Paciente em atendimento
                            </span>
                        </div>

                        <div className="consult-patient-meta">
                            <span>
                                {paciente.idade
                                    ? `${paciente.idade} anos`
                                    : "Idade não informada"}
                            </span>

                            <span className="consult-patient-meta-divider">|</span>

                            <span>
                                {paciente.sexo || "Sexo não informado"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="consult-left-divider" />

                    <div className="consult-context-block">
                        <div className="consult-context-title">
                            <span>▣</span>
                            <h4>Receitas anteriores</h4>
                        </div>

                        <div className="consult-prescription-list">
                            {anotacoes.length > 0 ? (
                                anotacoes.map((anotacao) => (
                                    <div
                                        className="consult-prescription-row"
                                        key={anotacao.id}>
                                    
                                        <div className="consult-prescription-date">
                                            {formatDate(anotacao.data)}
                                        </div>

                                        <div className="consult-prescription-content">
                                            <b>{anotacao.medicoNome}</b>

                                            <p>
                                                {anotacao.resumo || "Nenhuma receita registrada."}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="consult-empty-line">
                                    Nenhuma receita anterior encontrada.
                                </div>
                            )}
                        </div>
                    </div>

                <div className="consult-left-divider" />

                <div className="consult-bottom-grid consult-bottom-grid-only-history">
                    <div className="consult-mini-history">
                        <div className="consult-context-title">
                            <span>◷</span>
                            <h4>Consultas anteriores</h4>
                        </div>

                        <div className="consult-history-list">
                            {consultasAnteriores.length > 0 ? (
                                consultasAnteriores.map((item) => (
                                    <div key={item.id}>
                                        <span>{formatDate(item.data)}</span>

                                        <b>{item.motivo || "Consulta"}</b>

                                        <small>
                                            {item.tipoConsulta || "ONLINE"}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <div className="consult-empty-line">
                                    Nenhuma consulta anterior encontrada.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="consult-medic-right-section">
            <div className="consult-medic-right">
                <div className="consult-register-header">
                    <div className="consult-register-title">
                        <span className="consult-register-icon">▤</span>
                        <h2>Resultados da consulta</h2>
                    </div>
                </div>

                <div className="consult-form-block">
                    <label>Resultados da consulta</label>

                    <textarea
                        maxLength={2000}
                        value={resultadoConsulta}
                        onChange={(event) => setResultadoConsulta(event.target.value)}
                        disabled={consultaFinalizada || salvando || finalizando}
                        placeholder="Registre os resultados clínicos desta consulta..." />
                    

                    <span>{resultadoConsulta.length}/2000</span>
                </div>

                <div className="consult-form-block">
                    <label>Observações</label>

                    <textarea
                        maxLength={2000}
                        value={observacoes}
                        onChange={(event) => setObservacoes(event.target.value)}
                        disabled={consultaFinalizada || salvando || finalizando}
                        placeholder="Adicione observações complementares, evolução do quadro ou fatores relevantes..." />
                    

                    <span>{observacoes.length}/2000</span>
                </div>

                <div className="consult-form-block">
                    <label>Conduta</label>

                    <textarea
                        maxLength={2000}
                        value={conduta}
                        onChange={(event) => setConduta(event.target.value)}
                        disabled={consultaFinalizada || salvando || finalizando}
                        placeholder="Descreva a conduta adotada, orientações e plano terapêutico..." />
                                        

                    <span>{conduta.length}/2000</span>
                </div>

                <div className="consult-form-block">
                    <label>Medicamentos / Receita</label>

                    <textarea
                        maxLength={2000}
                        value={receita}
                        onChange={(event) => setReceita(event.target.value)}
                        disabled={consultaFinalizada || salvando || finalizando}
                        placeholder="Informe medicamentos, dosagens, frequência de uso e duração do tratamento..." />
                    

                    <span>{receita.length}/2000</span>
                </div>

                <div className="consult-register-actions">
                    <button
                        type="button"
                        className="consult-save-button"
                        onClick={handleSalvarAnotacoes}
                        disabled={consultaFinalizada || salvando || finalizando}>
                    
                        {salvando ? "Salvando..." : "Salvar anotações"}
                    </button>

                    <button
                        type="button"
                        className="consult-finish-button"
                        onClick={handleFinalizarConsulta}
                        disabled={consultaFinalizada || salvando || finalizando}>
                    
                        {finalizando ? "Finalizando..." : "Finalizar consulta"}
                    </button>
                </div>

                        {mensagemRegistro && (
                            <p className="consult-register-message consult-register-success">
                                {mensagemRegistro}
                            </p>
                        )}

                        {erroRegistro && (
                            <p className="consult-register-message consult-register-error">
                                {erroRegistro}
                            </p>
                        )}
            </div>
        </section>
    </section>
  )
}