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
import './teams.css'

export default function online() {
  
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

    const [teamsCode, setTeamsCode] = useState("MED-8421")
    const [copyMessage, setCopyMessage] = useState("")

    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const numbers = "23456789"
    const mixedChars = `${letters}${numbers}`

    function getRandomChar(chars: string) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        return chars[randomIndex]
    }

    function shuffleCode(chars: string[]) {
        return chars
            .map((char) => ({
                char,
                order: Math.random(),
            }))
            .sort((a, b) => a.order - b.order)
            .map((item) => item.char)
            .join("")
    }

    function generateTeamsCode() {
        const codeChars = [
            getRandomChar(letters),
            getRandomChar(numbers),
            getRandomChar(mixedChars),
            getRandomChar(mixedChars),
        ]

        return `MED-${shuffleCode(codeChars)}`
    }

    function handleEnterTeamsRoom() {
        const newCode = generateTeamsCode()

        setTeamsCode(newCode)
        setCopyMessage("")

        window.open("https://teams.microsoft.com/", "_blank", "noopener,noreferrer")
    }

    async function handleCopyTeamsCode() {
        try {
            await navigator.clipboard.writeText(teamsCode)

            setCopyMessage("Código copiado com sucesso.")

            setTimeout(() => {
                setCopyMessage("")
            }, 2500)
        } catch (error) {
            console.log("ERRO AO COPIAR CÓDIGO:", error)

            setCopyMessage("Não foi possível copiar o código.")

            setTimeout(() => {
                setCopyMessage("")
            }, 2500)
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
             CONSULTA {" "} 

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>&nbsp;</span>
                <span>O</span>
                <span>N</span>
                <span>L</span>
                <span>I</span>                
                <span>N</span>
                <span>E</span>
            </span>

            </h1>
        </div>

        <div className="online-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="online-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "online-bell-new-animate" : "" }`}/>

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

<section className="teams-card">

    <div className="teams-card-top">
        <div className="teams-icon-box">
            <img
                src="/images/agendamento/icons/TEAMS.png"
                alt="Microsoft Teams"
                className="teams-header-icon"
            />
        </div>

        <div>
            <h3>ACESSO À SALA</h3>
            <p>Entre na sala da sua consulta pelo Microsoft Teams.</p>
        </div>
    </div>

    <button
        type="button"
        onClick={handleEnterTeamsRoom}
        className="teams-enter-button"
    >
        <img
            src="/images/agendamento/icons/TEAMS.png"
            alt="Microsoft Teams"
            className="teams-button-icon"
        />

        <span>Entrar na sala do Microsoft Teams</span>
    </button>

    <div className="teams-or-line">
        <div></div>
        <span>OU</span>
        <div></div>
    </div>

    <div className="teams-code-block">
        <p>Código da sala</p>

        <div className="teams-code-content">
            <div className="teams-code">
                {teamsCode}
            </div>

            <button
                type="button"
                className="teams-copy-code"
                onClick={handleCopyTeamsCode}
            >
                {copyMessage ? "Copiado!" : "Copiar código"}
            </button>
        </div>

        {copyMessage && (
            <p className="teams-copy-message">
                {copyMessage}
            </p>
        )}
    </div>

    <div className="teams-warning">
        <span>i</span>

        <p>
            Se o Microsoft Teams solicitar um código,
            utilize o código da sala exibido acima.
        </p>
    </div>
</section>

  </section>
</main>
  );
}


