"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { requiredSession } from "../lib/required"

import {
    API_BASE_URL,
    getHomeData,
    sendActivity,
    getAccessStatus,
    getMinhasConsultas,
    getConsultaRoomContexto,
    type ConsultaMinha,
    type ConsultaRoomContexto,
} from "@/app/lib/auth"

import ConsultRoom from "./components/ConsultRoom"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './cardleft-p.css'

export default function consultasPage() {

    const searchParams = useSearchParams()
    const consultaId = searchParams.get("id")

    const router = useRouter();
    
    const [checkingSession, setCheckingSession] = useState(true)

    const [hasNotifications, setHasNotifications] = useState(false)
    
    const [bellState, setBellState] = useState<"none" | "new" | "pending">("none")

    const [user, setUser] = useState({
        name: "",
        role: "",
        avatar: "",
    })

    type HealthPlanTier = "NONE" | "BRONZE" | "PRATA" | "GOLD" | "PLATINUM"

    const [healthTier, setHealthTier] = useState<HealthPlanTier>("NONE")

    type AccessState = "ONLINE" | "OFFLINE"

    const [accessState, setAccessState] = useState<AccessState>("OFFLINE")

    useEffect(() => {
        async function verifySession() {
            const session = await requiredSession()

            if (!session.authenticated) {
                router.push("/login")
                return
            }

            const homeData = await getHomeData()

            if (homeData.success) {
                setUser({
                    name: homeData.usuario.nome,
                    role: homeData.usuario.tipo,
                    avatar: homeData.usuario.avatar
                        ? `${API_BASE_URL}${homeData.usuario.avatar}`
                        : "",
                })

                setHasNotifications(homeData.notificacoes.hasNotifications)

                if (homeData.notificacoes.initialBellState) {
                    setBellState(homeData.notificacoes.initialBellState)
                }

                setHealthTier(homeData.plano.tier)
                setAccessState(homeData.acesso.state)
            }

            setCheckingSession(false)
        }

        verifySession()
    }, [router])

    useEffect(() => {
        if (!hasNotifications) {
            setBellState("none")
            return
        }

        setBellState("new")

        const timer = setTimeout(() => {
            setBellState("pending")
        }, 30 * 1000)

        return () => clearTimeout(timer)
    }, [hasNotifications])

    const lastActivityRef = useRef(Date.now())

    useEffect(() => {
        function markActivity() {
            lastActivityRef.current = Date.now()
        }

        window.addEventListener("mousemove", markActivity)
        window.addEventListener("click", markActivity)
        window.addEventListener("keydown", markActivity)
        window.addEventListener("scroll", markActivity)
        window.addEventListener("touchstart", markActivity)

        return () => {
            window.removeEventListener("mousemove", markActivity)
            window.removeEventListener("click", markActivity)
            window.removeEventListener("keydown", markActivity)
            window.removeEventListener("scroll", markActivity)
            window.removeEventListener("touchstart", markActivity)
        }
    }, [])

    useEffect(() => {
        async function updateActivity() {
            const data = await sendActivity()

            if (data.success) {
                setAccessState(data.state)
            }
        }

        async function checkStatus() {
            const data = await getAccessStatus()

            if (data.success) {
                setAccessState(data.state)
            }
        }

        async function presenceLoop() {
            const now = Date.now()
            const inactiveTime = now - lastActivityRef.current

            if (inactiveTime < 60 * 1000) {
                await updateActivity()
                return
            }

            await checkStatus()
        }
    }, [])

    const bellStatus = {
        none: "/images/home/icons/BELL-1.png",
        new: "/images/home/icons/BELL-2.png",
        pending: "/images/home/icons/BELL-3.png",
    }

    const Bell = bellStatus[bellState]

    const healthTierColor = {
        NONE: "#ffffff00",
        BRONZE: "#ff7b00",
        PRATA: "#c7d8dd",
        GOLD: "#ffe600e8",
        PLATINUM: "#47fddfbb",
    };

    const healthTierLabel = {
        NONE: "None",
        BRONZE: "Bronze",
        PRATA: "Prata",
        GOLD: "Gold",
        PLATINUM:"Platinum"
    };

    const healthTierIcon: Record<Exclude<HealthPlanTier, "NONE">, string> = {
        BRONZE: "/images/home/images/SHIELD-COPP.png",
        PRATA: "/images/home/images/SHIELD-PRAT.png",
        GOLD: "/images/home/images/SHIELD-GOLD.png",
        PLATINUM: "/images/home/images/SHIELD-NONE.png",
    };

    const accessStateColor = {
        ONLINE: "#2a9d8a",
        OFFLINE: "#c52727",
    };

    const accessStateLabel = {
        ONLINE: "Online",
        OFFLINE: "Offline",
    };

    const accessStateTitle = {
        ONLINE: "Acesso",
        OFFLINE: "Acesso",
    };

    const accessStateIcon = {
        ONLINE: "/images/home/images/WIFI-FULL.png",
        OFFLINE: "/images/home/images/WIFI-LOW.png",
    };

    const [consultaDaSala, setConsultaDaSala] = useState<ConsultaMinha | null>(null)
    const [contextoRoom, setContextoRoom] = useState<ConsultaRoomContexto | null>(null)
    const [loadingRoom, setLoadingRoom] = useState(false)
    const [erroRoom, setErroRoom] = useState("")


    useEffect(() => {
        async function loadConsultaDaSala() {
            if (!consultaId) {
                setConsultaDaSala(null)
                setContextoRoom(null)
                return
            }

            const consultaIdNumber = Number(consultaId)

            if (Number.isNaN(consultaIdNumber)) {
                setConsultaDaSala(null)
                setContextoRoom(null)
                setErroRoom("ID da consulta inválido")
                return
            }

            try {
                setLoadingRoom(true)
                setErroRoom("")
                setConsultaDaSala(null)
                setContextoRoom(null)

                const data = await getMinhasConsultas()

                console.log("CONSULTAS PARA SALA:", data)

                if (!data.success) {
                    setConsultaDaSala(null)
                    setContextoRoom(null)
                    setErroRoom(data.message || "Erro ao buscar consultas")
                    return
                }

                const consulta = data.consultas.find(
                    (item: ConsultaMinha) => item.id === consultaIdNumber
                )

                if (!consulta) {
                    setConsultaDaSala(null)
                    setContextoRoom(null)
                    setErroRoom("Consulta não encontrada para este usuário")
                    return
                }

                setConsultaDaSala(consulta)

                const roomData = await getConsultaRoomContexto(consultaIdNumber)

                console.log("CONSULTA ROOM CONTEXTO:", roomData)

                if (!roomData.success) {
                    setContextoRoom(null)
                    setErroRoom(roomData.message || "Erro ao carregar sala da consulta")
                    return
                }

                setContextoRoom(roomData.contexto)
            } catch (error) {
                console.log("ERRO AO BUSCAR CONSULTA DA SALA:", error)
                setConsultaDaSala(null)
                setContextoRoom(null)
                setErroRoom("Erro ao carregar consulta")
            } finally {
                setLoadingRoom(false)
            }
        }

        loadConsultaDaSala()
    }, [consultaId])

    const isMedic = user.role?.toUpperCase() === "MEDICO"
    const isPacient = user.role?.toUpperCase() === "PACIENTE"

    const roomRegistro = contextoRoom?.room

    const resumoClinico =
        roomRegistro?.notasMedicas?.trim() ||
        "Registro clínico ainda não preenchido."

    const observacoesPaciente =
        roomRegistro?.observacoes?.trim() ||
        "Nenhuma observação médica registrada."

    const condutaPaciente =
        roomRegistro?.conduta?.trim() ||
        "Nenhuma conduta registrada."

    const receitaPaciente =
        roomRegistro?.medicamentos?.trim() ||
        "Nenhuma prescrição registrada."

    const condutaLinhas = condutaPaciente
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean)

    function formatStatusLabel(status?: string | null) {
        if (!status) {
            return "EM ANDAMENTO"
        }

        return status.replace("_", " ")
    }
    
    const medicoRegistro =
        contextoRoom?.consulta?.medicoNumeroRegistro ||
        "Registro não informado" 


    async function baixarLaudoPdf() {
        if (!consultaDaSala?.id) return

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/consulta-room/${consultaDaSala.id}/laudo-pdf`,
                {
                    method: "GET",
                    credentials: "include",
                }
            )

            if (!response.ok) {
                console.log("Erro ao baixar laudo")
                return
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = `laudo-consulta-${consultaDaSala.id}.pdf`

            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.log("ERRO AO BAIXAR LAUDO:", error)
        }
    }

    if (checkingSession) {
        return null
    }

  return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                SALA DE {" "} 

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>C</span>
                <span>O</span>
                <span>N</span>
                <span>S</span>
                <span>U</span>
                <span>L</span>
                <span>T</span>
                <span>A</span>
                <span>S</span>

            </span>

            </h1>
        </div>

        <div className="agd-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="agd-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "agd-bell-new-animate" : "" }`}/>

            </div>
        </div>

        <div className="user-area mr-20 mt-[40px] flex items-center gap-[30px]">
            <div className="text-right">

                <p className="text-[18px] font-black text-slate-800">
                    {user.name || "Usuário"}
                </p>

                <p className="text-[14px] font-semibold text-slate-500">
                    {user.role || "Paciente"}
                </p>

            </div>

            <div onClick={() => router.push("/profile")} 
                className="profile-card relative flex h-[100px] w-[100px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">
            {user.avatar ? (
            
                <img
                    src={user.avatar}
                    alt="Foto de perfil"
                    className="profile-avatar-image"/>
                 ) : (
                <span className="profile-avatar-fallback">
                    {(user.name || "U").charAt(0).toUpperCase()}
                </span>
            )}
           </div>
        </div>

    </header>

    <h2 className="ml-[85px] text-[22px] font-medium text-slate-500">
        Te auxiliando a encontrar especialistas para sua condição.
    </h2>

   <section className="home-info-row ml-[789px] mt-[80px] flex items-center justify-between">

        <div className="info-cards">
            <div className="mini-card mr-[100px]">

                <div className="mini-card-text">          
                    <p className="mini-info-title uppercase">Plano</p>
                        
                    <p className="mini-info-subtitle uppercase"
                        style={{ color: healthTierColor[healthTier] }}>
                        {healthTierLabel[healthTier]}
                    </p>

                </div>

                <div className={`plan-icon-stack plan-${healthTier.toLowerCase()}`}>
                    {healthTier !== "NONE" && (
                        <img
                            src={healthTierIcon[healthTier]}
                            alt={`Plano ${healthTierLabel[healthTier]}`}
                            className="plan-shield-icon"/>
                    )}
                </div>
            </div>

            <div className="mini-card-2">
                <div className="mini-card-2-text">
                    <p className="mini-info-title-2 uppercase">acesso</p>

                    <p className="mini-info-subtitle-2 uppercase"
                        style={{ color: accessStateColor[accessState] }}>

                        {accessStateLabel[accessState]}
                    </p>
                </div>

                <div className="access-icon-stack">
                    <img
                        src={accessStateIcon[accessState]}
                        alt={`Acesso ${accessStateLabel[accessState]}`}
                        className="access-wifi-icon"/>
                </div>

            </div>
        </div>
    </section>

    <section className="consult-attendance-section">
        {isMedic && consultaDaSala && contextoRoom && (
            <ConsultRoom
                consulta={consultaDaSala}
                contexto={contextoRoom} />
        
        )}

        {isPacient && consultaDaSala && contextoRoom && (
            <section className="patient-consult-panel">
                <div className="patient-clinical-card">
                    <div className="patient-card-header">
                        <div className="patient-title-box">
                            <span className="patient-title-icon">▤</span>

                            <div>
                                <h2>Resumo clínico</h2>
                                <p>Informações principais da consulta</p>
                            </div>
                        </div>

                        <span className="patient-status-tag">
                            {formatStatusLabel(consultaDaSala.status)}
                        </span>
                    </div>

                    <div className="patient-summary-line">
                        <div className="patient-summary-cell patient-summary-doctor">
                            <small>Médica</small>
                            <strong>{consultaDaSala.medicoNome || "Médico não informado"}</strong>
                            <span>{medicoRegistro}</span>
                        </div>

                        <div className="patient-summary-cell">
                            <small>Especialidade</small>
                            <strong>{consultaDaSala.especialidade || "Não informada"}</strong>
                        </div>

                        <div className="patient-summary-cell">
                            <small>Data</small>
                            <strong>{consultaDaSala.data || "Sem data"}</strong>
                        </div>

                        <div className="patient-summary-cell">
                            <small>Horário</small>
                            <strong>{consultaDaSala.hora || "Sem horário"}</strong>
                        </div>

                        <div className="patient-summary-cell">
                            <small>Consulta</small>
                            <strong>{consultaDaSala.tipoConsulta || "ONLINE"}</strong>
                        </div>

                        <div className="patient-summary-cell patient-summary-reason">
                            <small>Motivo</small>
                            <strong>{consultaDaSala.motivo || "Consulta"}</strong>
                        </div>
                    </div>

                    <p className="patient-clinical-text">
                        {resumoClinico}
                    </p>
                </div>

                <div className="patient-register-card">
                    <div className="patient-card-header">
                        <div className="patient-title-box">
                            <span className="patient-title-icon">▧</span>

                            <div>
                                <h2>Registro da consulta</h2>
                                <p>Resumo do atendimento realizado</p>
                            </div>
                        </div>
                    </div>

                    <div className="patient-register-columns">
                        <div className="patient-register-section">
                            <h3>Observações médicas</h3>
                            <p>{observacoesPaciente}</p>
                        </div>

                        <div className="patient-register-section">
                            <h3>Conduta / orientações</h3>

                            <ul>
                                {condutaLinhas.map((linha, index) => (
                                    <li key={`${linha}-${index}`}>
                                        {linha}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="patient-register-section">
                            <h3>Receita / prescrição</h3>

                            <div className="patient-prescription-card">
                                <strong>{receitaPaciente}</strong>
                                <span>Prescrição registrada pelo médico responsável.</span>
                            </div>
                        </div>
                    </div>

                    <div className="patient-register-actions">





                        <button
                            type="button"
                            className="patient-download-button"
                            onClick={baixarLaudoPdf}
                        >
                            BAIXAR REGISTRO DA CONSULTA
                        </button>





                        <button
                            type="button"
                            className="patient-view-button"
                            onClick={() => {
                                if (!consultaDaSala?.id) return

                                router.push(`/laudo?id=${consultaDaSala.id}`)
                            }}>
                        
                            VISUALIZAR REGISTRO
                        </button>
                    </div>
                </div>
            </section>
        )}

        {!consultaDaSala && (
            <div className="consult-empty-card">
                <h2>Consulta não encontrada</h2>
                <p>Essa consulta não existe ou não pertence ao usuário logado.</p>
            </div>
        )}
    </section>


  </section>
</main>
  );
}