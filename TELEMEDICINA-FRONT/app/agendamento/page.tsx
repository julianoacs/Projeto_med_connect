"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import {
  API_BASE_URL,
  getHomeData,
  sendActivity,
  getAccessStatus,
  getMedicos,
} from "../lib/auth"

import MedAgendamentoPanel from "./components/MedAgdPanel"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './pacient.css'
import './new.css'
import './backagd.css'
import './agendaL.css'
import './agendaR.css' 
import './mypacient.css'
import './selected.css'

type PacientConsulta = {
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

type MedConsult = {
    id: number
    nome: string
    email?: string
    tipo?: string
    especialidade?: string
    tipoRegistro?: string
    numeroRegistro?: string
    avatar?: string | null
}


export default function agendamento() {
  
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

    const isMedico = user.role?.toUpperCase() === "MEDICO"
    const isPacient = user.role?.toUpperCase() === "PACIENTE"
    const isAdmin = user.role?.toUpperCase() === "ADMIN"
    const [agdMedicos, setAgdMedicos] = useState<MedConsult[]>([])
    const [selectedAgdMedico, setSelectedAgdMedico] = useState<MedConsult | null>(null)
    const [pacientTab, setPacientTab] = useState<"next" | "my">("next")
    const [doctorTab, setDoctorTab] = useState<"next" | "my">("next")


    const agd_esp = [
        {
            name: "Clínico Geral",
            icon: "/images/medicos/icons/GERAL.png",
        },
        {
            name: "Cardiologista",
            icon: "/images/medicos/icons/CARDIO.png",
        },
        {
            name: "Neurologista",
            icon: "/images/medicos/icons/NEURO.png",
        },
        {
            name: "Psicologo",
            icon: "/images/medicos/icons/PSICO.png",
        },
        {
            name: "Nutrologista",
            icon: "/images/medicos/icons/NUTRI.png",
        },
        {
            name: "Oncologista",
            icon: "/images/medicos/icons/ONCO.png",
        },
    ]

    async function openPacientAgd(especialidade: string) {
        setSelectedAgd(especialidade)
        setPacientView("specialSession")
        setLoadingAgdMedicos(true)

        const data = await getMedicos(especialidade)

            console.log("MÉDICOS PARA AGENDAMENTO:", data)

        setLoadingAgdMedicos(false)

        if (!data.success) {
            console.log(data.message)
            setAgdMedicos([])
            return
        }

        setAgdMedicos(data.medicos || [])
    }

    const [pacientView, setPacientView] = useState<"specialties" | "specialSession">("specialties")
    const [selectedAgd, setSelectedAgd] = useState("")
    const [loadingAgdMedicos, setLoadingAgdMedicos] = useState(false)

    function backToSpecialties() {
        setPacientView("specialties")
        setSelectedAgd("")
        setAgdMedicos([])
    }

    const [selectedReason, setSelectedReason] = useState("")

    function toggleReason(reason: string) {
        setSelectedReason((current) =>
            current === reason ? "" : reason
        )
    }

    type AgdDay = {
        value: string
        week: string
        day: string
        month: string
    }

    type AgdHour = {
        id: number
        hora: string
        ocupado: boolean
    }

    const [agdDays, setAgdDays] = useState<AgdDay[]>([])
    const [agdHours, setAgdHours] = useState<AgdHour[]>([])

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedHour, setSelectedHour] = useState("")

    const [dayStart, setDayStart] = useState(() => {
        return new Date().toISOString().split("T")[0]
    })

    useEffect(() => {
        async function loadDays() {
            const response = await fetch(
                `${API_BASE_URL}/api/agendamentos/dias?start=${dayStart}&limit=4`,
                {
                    credentials: "include",
                }
            )

            const data = await response.json()

            if (!data.success) {
                console.log(data.message)
                return
            }

            setAgdDays(data.dias || [])
        }

        loadDays()
    }, [dayStart])

    useEffect(() => {
        async function loadHours() {
            if (!selectedAgdMedico || !selectedDate) {
                setAgdHours([])
                
                return
            }

            const response = await fetch(
                `${API_BASE_URL}/api/agendamentos/horarios?medico=${encodeURIComponent(selectedAgdMedico.nome)}&data=${selectedDate}`,
                {
                    credentials: "include",
                }
            )

            const data = await response.json()
            console.log("HORÁRIOS DATA:", data)
            if (!data.success) {
                console.log(data.message)
                return
            }

            setAgdHours(data.horarios || [])
        }

        loadHours()
    }, [selectedAgdMedico, selectedDate])

    function toggleDate(date: string) {
        setSelectedDate((current) => current === date ? "" : date)
        setSelectedHour("")
    }

    function toggleHour(hour: string) {
        setSelectedHour((current) => current === hour ? "" : hour)
    }

    async function concluirAgendamento() {
        console.log("CLIQUEI NO CONCLUIR")
        console.log({
            medicoNome: selectedAgdMedico?.nome,
            especialidade: selectedAgd,
            pacienteNome: user.name,
            data: selectedDate,
            hora: selectedHour,
            motivo: selectedReason,
        })

        if (!selectedAgdMedico || !selectedReason || !selectedDate || !selectedHour) {
            console.log("Faltam dados para concluir o agendamento")
            return
        }

        const response = await fetch(`${API_BASE_URL}/api/agendamentos/horarios`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                medicoId: selectedAgdMedico.id,
                medicoNome: selectedAgdMedico.nome,
                especialidade: selectedAgd,
                pacienteNome: user.name,
                data: selectedDate,
                hora: selectedHour,
                motivo: selectedReason,
            }),
        })

        console.log("STATUS POST:", response.status)

        const text = await response.text()

        console.log("POST RAW RESPONSE:", text)

        const data = text ? JSON.parse(text) : null

        console.log("AGENDAMENTO RESPONSE:", data)

        if (!data.success) {
            alert(data.message)
            return
        }

        alert("Agendamento concluído com sucesso!")

        setSelectedHour("")
        setSelectedDate("")
        setSelectedReason("")
        setSelectedAgdMedico(null)

        setPacientView("specialties")
        setSelectedAgd("")
        setAgdMedicos([])
    }

    const canFinishAgendamento = Boolean(
        selectedAgdMedico &&
        selectedReason &&
        selectedDate &&
        selectedHour
    )

    useEffect(() => {
        console.log("ESTADO DO AGENDAMENTO:", {
            medico: selectedAgdMedico?.nome,
            motivo: selectedReason,
            data: selectedDate,
            hora: selectedHour,
            canFinish: Boolean(
                selectedAgdMedico &&
                selectedReason &&
                selectedDate &&
                selectedHour
            ),
        })
    }, [selectedAgdMedico, selectedReason, selectedDate, selectedHour])

    const [pacientConsultas, setPacientConsultas] = useState<PacientConsulta[]>([])
    const [loadingPacientConsultas, setLoadingPacientConsultas] = useState(false)

    useEffect(() => {
        async function loadPacientConsultas() {
            if (pacientTab !== "my") return

            setLoadingPacientConsultas(true)

            try {
                const response = await fetch(`${API_BASE_URL}/api/consultas/minhas`, {
                    credentials: "include",
                })

                const data = await response.json()

                console.log("PACIENT CONSULTAS:", data)

                if (!data.success) {
                    console.log(data.message)
                    setPacientConsultas([])
                    return
                }

                setPacientConsultas(data.consultas || [])
            } catch (error) {
                console.log("ERRO AO BUSCAR CONSULTAS DO PACIENTE:", error)
                setPacientConsultas([])
            } finally {
                setLoadingPacientConsultas(false)
            }
        }

        loadPacientConsultas()
    }, [pacientTab])

    const searchParams = useSearchParams()

    const medicoIdParam = searchParams.get("medicoId")
    const especialidadeParam = searchParams.get("especialidade")

    useEffect(() => {
        async function applyAgendamentoPreset() {
            if (!especialidadeParam) {
                return
            }

            setSelectedAgd(especialidadeParam)
            setPacientView("specialSession")
            setLoadingAgdMedicos(true)

            try {
                const data = await getMedicos(especialidadeParam)

                console.log("PRESET MÉDICOS PARA AGENDAMENTO:", data)

                if (!data.success) {
                    console.log(data.message)
                    setAgdMedicos([])
                    return
                }

                const medicosCarregados: MedConsult[] = data.medicos || []

                setAgdMedicos(medicosCarregados)

                if (medicoIdParam) {
                    const medicoEncontrado = medicosCarregados.find(
                        (medico) => medico.id === Number(medicoIdParam)
                    )

                    if (medicoEncontrado) {
                        setSelectedAgdMedico(medicoEncontrado)
                    }
                }
            } catch (error) {
                console.log("ERRO AO APLICAR PRESET DE AGENDAMENTO:", error)
                setAgdMedicos([])
            } finally {
                setLoadingAgdMedicos(false)
            }
        }

        applyAgendamentoPreset()
    }, [especialidadeParam, medicoIdParam])


    if (checkingSession) {
        return null
    }

  return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                CENTRAL DE {" "} 

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>A</span>
                <span>G</span>
                <span>E</span>
                <span>N</span>
                <span>D</span>
                <span>A</span>
                <span>M</span>
                <span>E</span>
                <span>N</span>
                <span>T</span>
                <span>O</span>
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
    
    <section className="agd-main-panel">

        {isMedico && (
            <MedAgendamentoPanel
            doctorTab={doctorTab}
            setDoctorTab={setDoctorTab}/>
        )}
        
        {isPacient && (
            <div className="agd-patient-panel">
                <div className="agd-tabs">
                    <button
                        type="button"
                        className={`agd-tab-next ${pacientTab === "next" ? "agd-tab-active" : ""}`}
                        onClick={() => {
                            setPacientTab("next")
                            setPacientView("specialties")
                        }}>

                        NOVOS AGENDAMENTOS
                    </button>

                    <button
                        type="button"
                        className={`agd-tab-my ${pacientTab === "my" ? "agd-tab-active" : ""}`}
                        onClick={() => {
                            setPacientTab("my")
                            setPacientView("specialties")
                            setSelectedAgd("")
                            setSelectedAgdMedico(null)
                            setAgdMedicos([])
                            setSelectedDate("")
                            setSelectedHour("")
                            setSelectedReason("")
                        }}>

                        MEUS AGENDAMENTOS
                    </button>
                </div>

                    {pacientTab === "next" && pacientView === "specialties" && (
                        <section className="agd-new-schedule-section">
                            <div className="agd-specialty-grid">
                                {agd_esp.map((card) => (
                                    <button
                                        key={card.name}
                                        type="button"
                                        className="agd-specialty-card"
                                        onClick={() => openPacientAgd(card.name)}>
                           
                                        <img
                                            src={card.icon}
                                            alt=""
                                            className="agd-specialty-icon"/>

                                        <span className="agd-specialty-name">
                                            {card.name}
                                        </span>

                                        <span className="agd-specialty-arrow">
                                            ›
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {pacientTab === "next" && pacientView === "specialSession" && (
                        <section className="agd-special-session">
                            <button
                                type="button"
                                className="agd-special-back"
                                onClick={() => {
                                    setPacientView("specialties")
                                    setSelectedAgd("")
                                    setSelectedAgdMedico(null)
                                    setAgdMedicos([])
                                }}>

                              VOLTAR
                            </button>

                            <div className="agd-special-header">
                                <h3>{selectedAgd}</h3>
                            </div>

                            <div className="agd-special-left">
                                <div className="agd-special-left-header">
                                    <h3>Especialistas da área</h3>
                                    <p>Médicos disponíveis para {selectedAgd}.</p>
                                </div>

                                <div className="agd-special-medicos">
                                    {agdMedicos.map((medico) => (
                                        <button
                                            key={medico.id}
                                            type="button"
                                            className={`agd-special-medico-card ${
                                                selectedAgdMedico?.id === medico.id ? "agd-special-medico-selected" : ""
                                            }`}
                                            onClick={() => {
                                                console.log("MÉDICO CLICADO:", medico)
                                                setSelectedAgdMedico(medico)
                                                setSelectedDate("")
                                                setSelectedHour("")
                                                setAgdHours([])
                                            }}>

                                            {medico.avatar ? (
                                                <img
                                                    src={`${API_BASE_URL}${medico.avatar}`}
                                                    alt={medico.nome}
                                                    className="agd-special-medico-img"/>
                                            ) : (
                                                <span className="agd-special-medico-fallback">
                                                    {(medico.nome || "M").charAt(0).toUpperCase()}
                                                </span>
                                            )}

                                            <div className="agd-special-medico-info">
                                                <strong>{medico.nome}</strong>
                                                <span>{medico.especialidade}</span>
                                                <small>{medico.numeroRegistro || "CRM não informado"}</small>
                                            </div>

                                            <span className="agd-special-medico-arrow">
                                                ›
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="agd-reason-section">
                                    <h3>Motivo do agendamento</h3>
                                    <p>Para que o {selectedAgd} em questão entenda sua situação.</p>
                                    <div className="agd-reason-grid">
                                        <button 
                                            type="button" 
                                            className={`agd-reason-card ${selectedReason === "Consulta" ? "agd-reason-selected" : ""}`}
                                             onClick={() => toggleReason("Consulta")}>
                                            
                                            <img
                                                src="/images/agendamento/icons/CONST.png"
                                                alt=""
                                                className="agd-reason-icon"/>
                                            
                                            <span>Consulta</span>
                                        </button>

                                        <button 
                                            type="button" 
                                            className={`agd-reason-card ${selectedReason === "Check-Up" ? "agd-reason-selected" : ""}`}
                                            onClick={() => {
                                                console.log("MOTIVO CLICADO:", "Check-Up")
                                                toggleReason("Check-Up")
                                            }}>

                                            <img
                                                src="/images/agendamento/icons/CHECK.png"
                                                alt=""
                                                className="agd-reason-icon"/>
                                            
                                            <span>Check-Up</span>
                                        </button>

                                        <button 
                                            type="button" 
                                            className={`agd-reason-card ${selectedReason === "Retorno" ? "agd-reason-selected" : ""}`}
                                            onClick={() => toggleReason("Retorno")}>
                                                
                                            <img
                                                src="/images/agendamento/icons/RETURN.png"
                                                alt=""
                                                className="agd-reason-icon"/>
                                            
                                            <span>Retorno</span>
                                        </button>

                                        <button 
                                            type="button" 
                                            className={`agd-reason-card ${selectedReason === "Diagnóstico" ? "agd-reason-selected" : ""}`}
                                            onClick={() => toggleReason("Diagnóstico")}>
                                                
                                            <img
                                                src="/images/agendamento/icons/DIAGN.png"
                                                alt=""
                                                className="agd-reason-icon"/>
                                            
                                            <span>Diagnóstico</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="agd-method-section">
                                    <div className="agd-method-card">
                                        <img
                                            src="/images/agendamento/icons/PC.png"
                                            alt=""
                                            className="agd-method-icon"/>
                                       
                                        <span>Consulta
                                        <br />
                                        online</span>
                                    </div>

                                    <div className="agd-method-card">
                                        <img
                                            src="/images/agendamento/icons/TEAMS.png"
                                            alt=""
                                            className="agd-method-icon"/>
                                        

                                        <span>Via Microsoft Teams</span>
                                    </div>

                                    <div className="agd-method-card">
                                        <img
                                            src="/images/agendamento/icons/LINK.png"
                                            alt=""
                                            className="agd-method-icon"/>

                                        <span>Link de confirmação</span>
                                    </div>
                                </div>
                            </div>

                            <div className="agd-special-right">
                                <div className="agd-special-right-header">
                                    <h3>Escolha uma data e horário</h3>
                                    <p>Selecione uma data e um horário disponível para continuar.</p>
                                </div>

                                <div className="agd-date-carousel">
                                    <button
                                        type="button"
                                        className="agd-date-arrow"
                                        onClick={() => {
                                            const date = new Date(dayStart)
                                            date.setDate(date.getDate() - 4)

                                            const today = new Date()
                                            today.setHours(0, 0, 0, 0)

                                            if (date < today) {
                                                setDayStart(today.toISOString().split("T")[0])
                                                setSelectedDate("")
                                                setSelectedHour("")
                                                return
                                            }

                                            setDayStart(date.toISOString().split("T")[0])
                                            setSelectedDate("")
                                            setSelectedHour("")
                                        }}>

                                        <span className="agd-date-arrow-icon">‹</span>
                                    </button>

                                    <div className="agd-date-row">
                                        {agdDays.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                className={`agd-date-card ${selectedDate === day.value ? "agd-date-selected" : ""}`}
                                                onClick={() => toggleDate(day.value)}>
                                            
                                                <strong>{day.week}</strong>
                                                <span>{day.day}</span>
                                                <small>{day.month}</small>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="agd-date-arrow"
                                        onClick={() => {
                                            const date = new Date(dayStart)
                                            date.setDate(date.getDate() + 4)

                                            setDayStart(date.toISOString().split("T")[0])
                                            setSelectedDate("")
                                            setSelectedHour("")
                                        }}>
                                    
                                       <span className="agd-date-arrow-icon">›</span>
                                    </button>
                                </div>

                                <div className="agd-hours-right-header">
                                </div>

                                <div className="agd-hour-grid">

                                {selectedAgdMedico && selectedDate && agdHours.map((hour) => (
                                    <button
                                        key={hour.id}
                                        type="button"
                                        disabled={hour.ocupado}
                                        className={`agd-hour-card ${
                                            selectedHour === hour.hora ? "agd-hour-selected" : ""
                                        } ${hour.ocupado ? "agd-hour-disabled" : ""}`}
                                        onClick={() => {
                                            if (!hour.ocupado) {
                                                toggleHour(hour.hora)
                                            }
                                        }}>

                                        {hour.hora.slice(0, 5)}
                                    </button>
                                ))}
                                </div>

                                <button
                                    type="button"
                                    className={`agd-continue-button ${!canFinishAgendamento ? "agd-continue-disabled" : ""}`}
                                    disabled={!canFinishAgendamento}
                                    onClick={() => {
                                        console.log("BOTÃO CLICADO")
                                        concluirAgendamento()
                                    }}>

                                    CONCLUIR AGENDAMENTO
                                </button>

                            </div>

                        </section>
                    )}

                        {pacientTab === "my" && (
                                <section className="my-pacient-agd-section">
                                    <div className="my-pacient-agd-header">
                                        <h3>Meus agendamentos</h3>
                                        <p>Consultas confirmadas pelos médicos e organizadas na sua agenda.</p>
                                    </div>

                                    <div className="my-pacient-agd-list">
                                        {loadingPacientConsultas ? (
                                            <div className="my-pacient-agd-empty">
                                                Carregando agendamentos...
                                            </div>
                                        ) : pacientConsultas.length > 0 ? (
                                            pacientConsultas.map((consulta) => (
                                                <button
                                                    key={consulta.id}
                                                    type="button"
                                                    className="my-pacient-agd-card"
                                                    onClick={() => router.push(`/consultas?id=${consulta.id}`)}>
                                                
                                                    <div className="my-pacient-agd-main">
                                                        <div className="my-pacient-agd-title">
                                                            <strong>{consulta.medicoNome}</strong>
                                                            <span>{consulta.status}</span>
                                                        </div>

                                                        <p>{consulta.motivo}</p>
                                                    </div>

                                                    <div className="my-pacient-agd-meta">
                                                        <span>{consulta.especialidade}</span>
                                                        <small>
                                                            {consulta.data} às {consulta.hora?.slice(0, 5)}
                                                        </small>
                                                    </div>

                                                    <div className="my-pacient-agd-arrow">
                                                        ›
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="my-pacient-agd-empty">
                                                Nenhum agendamento confirmado.
                                            </div>
                                        )}
                                    </div>
                                </section>
                        )}
            </div>
        )}
    </section>

  </section>
</main>
  );
}

