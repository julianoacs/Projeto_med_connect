"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import {
    getHomeData,
    sendActivity,
    getAccessStatus,
    iniciarConsultaRoom,
    checkConsultasFinalizadas,
} from "../lib/auth"

import Admin from "./components/Admin"

import './headtext.css'
import './bell.css'
import './profile.css'
import './search.css'
import './info.css'
import './info2.css'
import './info3.css'
import './carousel.css'
import './cards.css'
import './cardsB.css'
import './consult.css'
import './data.css'
import './medic.css'
import './medicB.css'
import './heart.css'


export default function Home() {

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

    const carouselCards = [
        {
            id: "agendamento",
            title: "Agendamento",
            image: "/images/home/images/AGD-2.png",
        },

        { 
            id: "medicos",
            title: "Médicos",
            image: "/images/home/images/MED-1.png",
        },

        {
            id: "exames",
            title: "Exames",
            image: "/images/home/images/EXM-1.png",
        },
    ];

    const [cards, setCards] = useState([

        {
            id: 1,
            type: "AGD",
            title: "Agendamento",
            alt: "Calendário de agendamentos",
        },

        {
            id: 2,
            type: "MED",
            title: "Médicos",
            alt: "Médicos disponíveis",
        },

        {
            id: 3,
            type: "EXM",
            title: "Exames",
            alt: "Exames laboratoriais",
        },
    ]);

    const [visibleCard, setVisibleCard] = useState(0);
    
    const visibleCards = [
        cards[visibleCard],
        cards[(visibleCard + 1) % cards.length],
    ];

    function nextCard() {
        setVisibleCard((prev) => (prev + 1) % cards.length);
    }

    function prevCard() {
        setVisibleCard((prev) =>
            prev === 0 ? cards.length - 1 : prev - 1
        );
    }

    type ConsultStatus = "reservada" | "aguardando" | "remarcada";
        const nextConsultStatus: ConsultStatus = "aguardando";

    function getConsultStatusInfo(status: ConsultStatus) {
        const statusMap = {
            reservada: {
                label: "Consulta reservada",
                color: "#2a9d8a",
                background:  "#2a9d8a23",
            },

            aguardando: {
                label: "Aguardando confirmação",
                color: "#e9da06",
                background: "#e9da0623",
            },

            remarcada: {
                label: "Consulta remarcada",
                color: "#c52727",
                background: "#c5272723" ,
            },
        };

        return statusMap[status];
    }
    const consultStatusInfo = getConsultStatusInfo(nextConsultStatus);

    type HomeConsulta = {
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

    const [nextConsulta, setNextConsulta] = useState<HomeConsulta | null>(null)
    const [loadingNextConsulta, setLoadingNextConsulta] = useState(false)

    const monthLabel = {
        "01": "Jan",
        "02": "Fev",
        "03": "Mar",
        "04": "Abr",
        "05": "Mai",
        "06": "Jun",
        "07": "Jul",
        "08": "Ago",
        "09": "Set",
        "10": "Out",
        "11": "Nov",
        "12": "Dez",
    }

    const weekdayLabel = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    function getConsultaDateInfo(dateValue?: string) {
        if (!dateValue) {
            return {
                month: "--",
                day: "--",
                weekday: "--",
            }
        }

        const date = new Date(`${dateValue}T00:00:00`)
        const monthNumber = dateValue.split("-")[1]

        return {
            month: monthLabel[monthNumber as keyof typeof monthLabel] || "--",
            day: String(date.getDate()).padStart(2, "0"),
            weekday: weekdayLabel[date.getDay()] || "--",
        }
    }

    useEffect(() => {
        async function loadNextConsulta() {
            setLoadingNextConsulta(true)

            try {
                const response = await fetch(`http://localhost:8080/api/consultas/minhas`, {
                    credentials: "include",
                })

                const data = await response.json()

                console.log("HOME CONSULTAS:", data)

                if (!data.success) {
                    console.log(data.message)
                    setNextConsulta(null)
                    return
                }

                const consultas: HomeConsulta[] = (data.consultas || []).filter(
                    (consulta: HomeConsulta) =>
                        consulta.status?.toUpperCase() !== "FINALIZADA"
                )

                if (consultas.length === 0) {
                    setNextConsulta(null)
                    return
                }

                const now = Date.now()

                const futuras = consultas
                    .filter((consulta) => {
                        const horaFormatada =
                            consulta.hora?.length === 5 ? `${consulta.hora}:00` : consulta.hora

                        const consultaDate = new Date(`${consulta.data}T${horaFormatada}`)
                        return consultaDate.getTime() >= now
                    })
                    .sort((a, b) => {
                        const horaA = a.hora?.length === 5 ? `${a.hora}:00` : a.hora
                        const horaB = b.hora?.length === 5 ? `${b.hora}:00` : b.hora

                        const dateA = new Date(`${a.data}T${horaA}`)
                        const dateB = new Date(`${b.data}T${horaB}`)

                        return dateA.getTime() - dateB.getTime()
                    })

                setNextConsulta(futuras[0] || null)
            } catch (error) {
                console.log("ERRO AO BUSCAR PRÓXIMA CONSULTA:", error)
                setNextConsulta(null)
            } finally {
                setLoadingNextConsulta(false)
            }
        }

        loadNextConsulta()
    }, [])

    const isMedico = user.role?.toUpperCase() === "MEDICO"

    const nextConsultaDate = getConsultaDateInfo(nextConsulta?.data)

    const nextConsultaStatusInfo = nextConsulta
        ? {
            label: "Confirmado",
            color: "#2a9d8a",
            background: "rgba(42, 157, 138, 0.12)",
        }
        : {
            label: "Sem consulta",
            color: "#dc2626",
            background: "rgba(220, 38, 38, 0.10)",
        }

    const nextConsultaHeading = isMedico
        ? "Próximo atendimento"
        : "Próxima consulta"

    const nextConsultaPersonName = nextConsulta
        ? isMedico
            ? nextConsulta.pacienteNome
            : nextConsulta.medicoNome
        : "Nenhuma consulta marcada"

    const nextConsultaPersonSubtitle = nextConsulta
        ? isMedico
            ? nextConsulta.motivo || "Paciente"
            : nextConsulta.especialidade || "Especialidade não informada"
        : "Você ainda não possui consultas confirmadas."


    const isAdmin = user.role?.toUpperCase() === "ADMIN"
    const isMedii = user.role?.toUpperCase() === "MEDICO"
    const isPacient = user.role?.toUpperCase() === "PACIENTE"



    async function handleIniciarAtendimento() {
        if (!nextConsulta) {
            return
        }

        if (!isMedico) {
            router.push(`/online?id=${nextConsulta.id}`)
            return
        }

        try {
            const data = await iniciarConsultaRoom(nextConsulta.id)

            if (!data.success) {
                console.log(data.message || "Erro ao iniciar atendimento")
                return
            }

            router.push(`/consultas?id=${nextConsulta.id}`)
        } catch (error) {
            console.log("ERRO AO INICIAR ATENDIMENTO:", error)
        }
    }

    async function handleLogout() {
        try {
            await logoutSession()
        } catch (error) {
            console.log("ERRO AO FAZER LOGOUT:", error)
        } finally {
            router.push("/login")
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
                Bem-vindo ao{" "}

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>M</span>
                <span>E</span>
                <span>D</span>
                <span>&nbsp;</span>
                <span>C</span>
                <span>O</span>
                <span>N</span>
                <span>N</span>
                <span>E</span>
                <span>C</span>
                <span>T</span>
            </span>

            </h1>
        </div>

        <div className="bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "bell-new-animate" : "" }`}/>

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
        Gerencie suas consultas, médicos e exames em um só lugar.
    </h2>

    <section className="home-info-row ml-[789px] mt-[80px] flex items-center justify-between">
        <div className="home-status-section">
            <div className="info-cards">

                <div className="mini-card-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mini-card-3-button">
                    
                        <div className="mini-card-3-text">
                            <p className="mini-info-title-3 uppercase">Sessão</p>

                            <p className="mini-info-subtitle-3 uppercase">
                                Sair
                            </p>
                        </div>

                        <div className="logout-icon-stack">
                            <span className="logout-card-symbol">⏻</span>
                        </div>
                    </button>
                </div>      

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

        </div>
    </section>
       

    <section className="carousel flex items-start mt-[80px]">
        <div className="carousel-info">

            <button
                type="button"
                onClick={prevCard}
                className="carousel-arrow group relative w-[60px] h-[60px] rounded-full bg-white border border-[#dce9e6] flex items-center justify-center
                shadow-md
                shrink-0
                transition-all duration-300
                hover:border-[#2a9d8a] hover:scale-100
                active:scale-105">

                    <span className="text-[#2a9d8a] text-[40px] leading-none mb-[4px] transition-all duration-300">
                        ‹
                    </span>

            </button>

            {visibleCards.map((card) => (
            <div key={card.id} className="carousel-card-slot">

                {card.type === "AGD" && (
                isAdmin ? (
            <Admin alt={card.alt} />
                ) : (
                <div className="agd-card">
                    <div className="agd-card-img">
                        
                        <img
                            src="/images/home/images/AGD-1.png"
                            alt={card.alt}
                            className="agd-image"/>   
                    </div>

                    <div className="agd-card-text">
                        <h1 className="agd-card-title uppercase">Agendamento</h1>
                        
                        <p className="agd-card-subtext">
                            Marque suas consultas rapidamente
                        </p>

                        <button onClick={() => router.push("/agendamento")} type="button" className="agd-card-button rounded-xl bg-[#2a9d8a] text-white">
                            Ver consultas
                        </button>
                    </div>

                </div>
                )
                )}

                {card.type === "MED" && (
                <div className="med-card">
                    <div className="med-card-img">
                        
                        <img
                            src="/images/home/images/MED-1.png"
                            alt={card.alt}
                            className="med-image"/>
                    </div>

                    <div className="med-card-text">
                        <h1 className="med-card-title uppercase">Médicos</h1>
                        
                        <p className="med-card-subtext">
                            Veja nossos especialistas
                        </p>

                        <button onClick={() => router.push("/medicos")} type="button" className="med-card-button rounded-xl bg-[#2a9d8a] text-white">
                            Ver médicos
                        </button>
                    </div>

                </div>
                )}

                {card.type === "EXM" && (
                <div className="exm-card">
                    <div className="exm-card-img">
                        
                        <img
                            src="/images/home/images/EXM-1.png"
                            alt={card.alt}
                            className="exm-image"/>
                    </div>

                    <div className="exm-card-text">
                        <h1 className="exm-card-title uppercase">Exames</h1>
                        
                        <p className="exm-card-subtext">
                            Consulte exames e veja os resultados
                        </p>

                        <button onClick={() => router.push("/exames")} type="button" className="exm-card-button rounded-xl bg-[#2a9d8a] text-white">
                             Ver exames
                        </button>

                    </div>

                </div>
                )}
            </div>
            ))}

            <button
                type="button"
                onClick={nextCard}
                className="carousel-arrow group relative w-[60px] h-[60px] rounded-full bg-white border border-[#dce9e6] flex items-center justify-center
                shadow-md
                shrink-0
                transition-all duration-300
                hover:border-[#2a9d8a] hover:scale-100
                active:scale-105">

                    <span className="text-[#2a9d8a] text-[40px] leading-none mb-[4px] transition-all duration-300">
                        ›
                    </span>

            </button>            

        </div>
    </section>


    <section className="card-actions items-start ml-[85px] mt-[100px]">
        <div className="next-consult-card">
            <div className="next-consult-header">
                <div className="next-consult-icon">
                    <img
                        src="/images/home/icons/CALENDAR.png"
                        alt="Calendário"
                        className="calendar-icon"/>
                </div>

                <h1 className="next-consult-heading uppercase">
                    {nextConsultaHeading}
                </h1>

                <div
                    className="next-consult-status-box"
                    style={{
                        background: nextConsultaStatusInfo.background,
                    }}>

                    <p
                        className="next-consult-status uppercase"
                        style={{
                            color: nextConsultaStatusInfo.color,
                        }}>
                            
                        {loadingNextConsulta
                            ? "Carregando"
                            : nextConsultaStatusInfo.label}
                    </p>
                </div>
            </div>

            <div className="consult-data">
                <div className="data-card">
                    <p className="next-consult-month uppercase">
                        {nextConsultaDate.month}
                    </p>

                    <p className="next-consult-day">
                        {nextConsultaDate.day}
                    </p>

                    <p className="next-consult-weekday">
                        {nextConsultaDate.weekday}
                    </p>
                </div>

                <div className="consult-pipe" />

                <div className="next-consult-details">
                    <h2 className="next-consult-doctor">
                        {loadingNextConsulta
                            ? "Carregando..."
                            : nextConsultaPersonName}
                    </h2>

                    <p className="next-consult-specialty">
                        {loadingNextConsulta
                            ? "Buscando sua próxima consulta..."
                            : nextConsultaPersonSubtitle}
                    </p>

                    <div className="next-consult-meta-row">
                        <div className="next-consult-meta-item">
                            <img
                                src="/images/home/icons/CLOCK.png"
                                alt="Horário"
                                className="next-consult-clock-icon"
                            />

                            <span>
                                {nextConsulta ? nextConsulta.hora?.slice(0, 5) : "--:--"}
                            </span>
                        </div>

                        <div className="next-consult-meta-separator" />

                        <div className="next-consult-meta-item">
                            <img
                                src="/images/home/icons/PC.png"
                                alt="Consulta online"
                                className="next-consult-pc-icon"
                            />

                            <span>
                                {nextConsulta
                                    ? nextConsulta.tipoConsulta || "Consulta Online"
                                    : "Sem modalidade"}
                            </span>
                        </div>
                    </div>

                    <div className="next-consult-buttons">
                        <button
                            type="button"
                            disabled={!nextConsulta}
                            onClick={() => {
                                if (!nextConsulta) return

                                router.push('online')
                            }}
                            className="next-consult-main-button">

                            {isMedico ? "Iniciar atendimento" : "Entrar na consulta"}
                        </button>

                        <button
                            type="button"
                            disabled={!nextConsulta}
                            onClick={() => {
                                if (!nextConsulta) return

                                router.push(`/consultas?id=${nextConsulta.id}`)
                            }}
                            className="next-consult-main-button">
                        
                            {isMedico ? "Ver paciente" : "Ver detalhes"}
                        </button>
                    </div>
                </div>

                <div className="consult-heart">
                    <svg
                        className="next-consult-ecg"
                        viewBox="0 0 520 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                            
                        <path
                            className="next-consult-ecg-line"
                            d="M0 65 
                            H90 
                            L110 65 
                            L120 40 
                            L135 90 
                            L155 25 
                            L175 65 
                            H245
                            L260 65 
                            L275 20 
                            L292 100 
                            L326 65
                            L340 45
                            L360 65
                            H430
                            L445 65
                            L455 40
                            L470 88
                            L485 65
                            H520"/>
                    </svg>

                    <img
                        src="/images/home/images/HEART.png"
                        alt="Coração"
                        className="next-consult-heart"/>

                </div>
            </div>
        </div>
    </section>

  </section>
</main>
  );
}