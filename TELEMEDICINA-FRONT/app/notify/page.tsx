"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"
import { getHomeData, sendActivity, getAccessStatus } from "../lib/auth"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './view.css'
import  './list.css'
import './side.css'
import './switch.css'

export default function Notify() {

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
                        ? `http://localhost:8080${homeData.usuario.avatar}`
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
    

    const [activeTab, setActiveTab] = useState<"all" | "read" | "unread">("all");

    const notificationsMock = [
        {
            id: 1,
            status: "unread",
            icon: "/images/notify/icons/CALD.png",
            title: "Consulta confirmada",
            description: "Sua consulta com Dr. Lucas Ferreira foi confirmada para 22 MAI às 10:30.",
          },

          {
            id: 2,
            status: "read",
            icon: "/images/notify/icons/EXME.png",
            title: "Resultado de exame disponível",
            description: "Seu exame de Hemograma Completo já está disponível.",
          },

          {
            id: 3,
            status: "unread",
            icon: "/images/notify/icons/CARD.png",
            title: "Pagamento aprovado",
            description: "Seu pagamento foi aprovado com sucesso.",
          },

          {
            id: 4,
            status: "read",
            icon: "/images/notify/icons/TMED.png",
            type: "plan",
            title: "Renovação do plano",
            description: "Seu plano Platinum será renovado automaticamente em 15/06/2024.",
          },
    ] as const;


    const visibleNotifications =
        activeTab === "all"
            ? notificationsMock
            : notificationsMock.filter((notification) => notification.status === activeTab);
   
    const [pushEnabled, setPushDisabled] = useState(true);
    const [emailEnabled, setEmailDisabled] = useState(true);
    const [smsEnabled, setSmsDisabled] = useState(false);

    if (checkingSession) {
        return null
    }

return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                MINHAS{" "}

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>N</span>
                <span>O</span>
                <span>T</span>
                <span>I</span>
                <span>F</span>
                <span>I</span>
                <span>C</span>
                <span>A</span>
                <span>ç</span>
                <span>Õ</span>
                <span>E</span>
                <span>S</span>
            </span>

            </h1>
        </div>

        <div className="notify-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="notify-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "notify-bell-new-animate" : "" }`}/>

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
        Gerencie suas informações pessoais e preferências.
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

    <section className="notify-box-row">
    <section className="box-view">
        <div className="notifications-tabs">

            <button type="button" 
                onClick={() => setActiveTab("all")} 
                className={`notification-tab read-tab ${activeTab === "all" ? "selected-tab" : ""}`}>
                    <span>TODAS</span>
                    <i className="tab-line left"></i>
                    <i className="tab-line right"></i>
            </button>

            <button type="button" 
                onClick={() => setActiveTab("read")} 
                className={`notification-tab read-tab ${activeTab === "read" ? "selected-tab" : ""}`}>
                    <span>LIDAS</span>
                    <i className="tab-line left"></i>
                    <i className="tab-line right"></i>
            </button>

            <button type="button" 
                onClick={() => setActiveTab("unread")} 
                className={`notification-tab read-tab ${activeTab === "unread" ? "selected-tab" : ""}`}>
                    <span>NÃO LIDAS</span>
                    <i className="tab-line left"></i>
                    <i className="tab-line right"></i>
            </button>
        </div>
 
        <div className="notifications-list">
        {visibleNotifications.map((notification) => (
            
            <div key={notification.id}
                className={`notification-item ${
                    notification.status === "unread"
                    ? "notification-unread"
                    : "notification-read"
                }`} >

                <span className="notification-status"></span>

            
                <div className="notification-icon">
                     <img src={notification.icon} alt={notification.title}/>
                </div>

                <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.description}</p>
                </div>

            </div>
        ))}
        </div>         
    </section>

    <section className="box-side">
        <div className="notify-toggle">

            <h3 className="notify-toggle-title">Preferências de notificação</h3>

                <div className="switch-toggle-push">

                     <div className="switch-text">
                        <strong>Notificações por Navegador</strong>
                            <br />
                        <span>Receba alertas no navegador</span>
                    </div>
  
                    <button type="button" 
                        onClick={() => setPushDisabled(!pushEnabled)}
                        className={`switch-button ${pushEnabled ? "switch-on" : "switch-off"}`}>
                        <span></span>
                    </button>

                </div>

                <div className="switch-toggle-email">

                     <div className="switch-text">
                        <strong>Notificações por Email</strong>
                            <br />
                        <span>Receba alertas no Email</span>
                    </div>
  
                    <button type="button" 
                        onClick={() => setEmailDisabled(!emailEnabled)}
                        className={`switch-button-1 ${emailEnabled? "switch-on" : "switch-off"}`}>
                        <span></span>
                    </button>

                </div>

                <div className="switch-toggle-sms">

                     <div className="switch-text">
                        <strong>Notificações por SMS</strong>
                            <br />
                        <span>Receba alertas no celular por SMS</span>
                    </div>
  
                    <button type="button" 
                        onClick={() => setSmsDisabled(!smsEnabled)}
                        className={`switch-button-2 ${smsEnabled ? "switch-on" : "switch-off"}`}>
                        <span></span>
                    </button>

                </div>

        </div>
    </section>

    </section>
  </section>
</main>
  );
}