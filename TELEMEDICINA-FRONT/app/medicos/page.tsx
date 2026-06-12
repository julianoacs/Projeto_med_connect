"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import {
  API_BASE_URL,
  getHomeData,
  sendActivity,
  getAccessStatus,
  getMedicos,
} from "../lib/auth"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './medi.css'
import './medicos.css'

export default function medicos() {
  
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

    const medIconCards = [
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

    type MedSpecialty = {
        id: number
        name: string
        icon: string
    }

    type MedConsult = {
        id: number
        nome: string
        email: string
        especialidade: string
        numeroRegistro: string
        avatar: string
        status: string
    }

    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [specialties, setSpecialties] = useState<MedSpecialty[]>([])
    const [medicos, setMedicos] = useState<MedConsult[]>([])

    useEffect(() => {
        async function loadMedicos() {
            const data = await getMedicos()

            console.log("MEDICOS DATA:", data)

            if (!data.success) {
                console.log(data.message)
                return
            }

            setMedicos(data.medicos || [])
        }

        loadMedicos()
    }, [])  
    
    function normalizeSpecialty(value: string) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
    }

    const filteredMedicos = selectedSpecialty
        ? medicos.filter((medico) =>
            normalizeSpecialty(medico.especialidade || "") ===
            normalizeSpecialty(selectedSpecialty)
        )
        : medicos

    if (checkingSession) {
        return null
    }

  return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                ÁREA {" "} 

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>M</span>
                <span>É</span>
                <span>D</span>
                <span>I</span>
                <span>C</span>
                <span>A</span>
            </span>

            </h1>
        </div>

        <div className="med-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="med-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "med-bell-new-animate" : "" }`}/>

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
                            className="plan-shield-icon"
                        />
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

    <section className="med-icon-cards">
        {medIconCards.map((card) => (
            <button
                onClick={() =>
                    setSelectedSpecialty((current) =>
                        current === card.name ? null : card.name
                    )
                }
                key={card.name}
                type="button"
                className={`med-icon-card ${
                    selectedSpecialty === card.name ? "med-icon-card-selected" : ""
                }`}
                aria-label={`Filtrar por ${card.name}`}>
                <img
                    src={card.icon}
                    alt=""
                    className="med-icon-card-img"/>

                <span className="med-icon-card-name">
                    {card.name}
                </span>
            </button>
        ))}
    </section>

    <section className="med-consult-cards">
        {filteredMedicos.length > 0 ? (
            filteredMedicos.map((medico) => (
                <article
                    key={medico.id}
                    className="med-consult-card">
                    <div className="med-consult-card-main">
                        {medico.avatar ? (
                            <img
                                src={`${API_BASE_URL}${medico.avatar}`}
                                alt={medico.nome}
                                className="med-consult-avatar-img"/>
                        ) : (
                            <span className="med-consult-avatar">
                                {(medico.nome || "M").charAt(0).toUpperCase()}
                            </span>
                        )}

                        <div className="med-consult-info">
                            <h3 className="med-consult-name">
                                {medico.nome}
                            </h3>

                            <p className="med-consult-specialty">
                                {medico.especialidade || "Especialidade não informada"}
                            </p>
                        </div>
                    </div>

                    <span className="med-consult-attendance online">
                        Online
                    </span>

                                
                    <button       
                        type="button"
                        className="med-consult-schedule"
                        onClick={() => {
                            const params = new URLSearchParams({
                                medicoId: String(medico.id),
                                especialidade: medico.especialidade || "",
                            })

                            router.push(`/agendamento?${params.toString()}`)
                        }}>
                        AGENDAR CONSULTA
                    </button>
                </article>
            ))
        ) : (
            <div className="med-consult-empty">
                {selectedSpecialty
                    ? `Nenhum médico encontrado em ${selectedSpecialty}.`
                    : "Nenhum médico carregado ainda."}
            </div>
        )}
    </section>

  </section>
</main>
  );
}