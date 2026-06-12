"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import "./pacientes.css"

import {
  API_BASE_URL,
  getHomeData,
  sendActivity,
  getAccessStatus,
  getMedicos,
} from "../lib/auth"

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

    type AdminPaciente = {
        id: number
        nome: string
        avatar?: string
        plano?: string
        status?: string
    }

    const [pacientes, setPacientes] = useState<AdminPaciente[]>([])
    const [loadingPacientes, setLoadingPacientes] = useState(false)
    
    const [searchPaciente, setSearchPaciente] = useState("")

    useEffect(() => {
        async function loadPacientes() {
            if (user.role?.toUpperCase() !== "ADMIN") return

            setLoadingPacientes(true)

            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/pacientes`, {
                    credentials: "include",
                })

                const data = await response.json()

                if (!data.success) {
                    console.log(data.message)
                    setPacientes([])
                    return
                }

                setPacientes(data.pacientes || [])
            } catch (error) {
                console.log("ERRO AO BUSCAR PACIENTES:", error)
                setPacientes([])
            } finally {
                setLoadingPacientes(false)
            }
        }

        loadPacientes()
    }, [user.role]) 

    const filteredPacientes = pacientes.filter((paciente) =>
        paciente.nome
            ?.toLowerCase()
            .includes(searchPaciente.toLowerCase())
    )
    
    if (checkingSession) {
        return null
    }

  return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                ALA DOS {" "} 

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>P</span>
                <span>A</span>
                <span>C</span>
                <span>I</span>
                <span>E</span>
                <span>N</span>
                <span>T</span>
                <span>E</span>
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
        Aqui a administração poderá ver todos os usuários cadastrados
    </h2>

   <section className="home-info-row ml-[85px] mt-[80px] flex items-center justify-between">

        <div className="search-line">
            <span className="search-line-icon">⌕</span>

            <input
                type="text"
                placeholder="Busque por exames aqui !"
                className="search-line-input"/>
        </div>

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

    <section className="pacients-admin-section">
        <div className="pacients-admin-header">
            <h3 className="Pacients-title uppercase">Pacientes cadastrados</h3>
        </div>

        <div className="pacients-admin-list">
            {loadingPacientes ? (
                <div className="pacients-admin-empty">
                    Carregando pacientes...
                </div>
            ) : filteredPacientes.length > 0 ? (
                filteredPacientes.map((paciente) => (
                    <div
                        key={paciente.id}
                        className="pacients-admin-card pacients-admin-card-sheet">
                    
                        <div className="pacients-admin-avatar">
                            {paciente.avatar ? (
                                <img
                                    src={`${API_BASE_URL}${paciente.avatar}`}
                                    alt={paciente.nome}/>
                                
                            ) : (
                                <span>{paciente.nome?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        <div className="pacients-admin-sheet">
                            <strong className="pacients-admin-value">
                                {paciente.nome}
                            </strong>

                            <strong className="pacients-admin-value pacients-admin-value-right">
                                {paciente.plano || "SEM PLANO"}
                            </strong>

                            <strong
                                className={`pacients-admin-value ${
                                    paciente.status?.toUpperCase() === "ONLINE"
                                        ? "pacients-status-online"
                                        : "pacients-status-offline"
                                }`}>
                            
                                {paciente.status || "OFFLINE"}
                            </strong>

                            <strong className="pacients-admin-value pacients-admin-value-right pacients-validated">
                                VALIDADO
                            </strong>

                        </div>
                    </div>
                ))
            ) : (
                <div className="pacients-admin-empty">
                    Nenhum paciente cadastrado.
                </div>
            )}
        </div>
    </section>

  </section>
</main>
  );
}