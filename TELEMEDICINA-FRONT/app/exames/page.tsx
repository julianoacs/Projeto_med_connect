"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import {
  API_BASE_URL,
  getHomeData,
  sendActivity,
  getAccessStatus,
  searchExamsG,
  getMinhasConsultas,
  enviarExamePaciente,
  getPedidosExamesDaConsulta,
  getExamesDaConsulta,
  criarPedidoExame,
  getArquivoUrl,
  type ExamsG,
  type ConsultaMinha,
  type PedidoExamePaciente,
} from "../lib/auth"

import MedExams from "./components/MedExams"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './barra.css'
import './tabs.css'
import './examsPL.css'
import './examsPR.css'
import './myexams.css'

export default function exames() {
  
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

    type AccessState = "ONLINE" | "OFFLINE"

    const [healthTier, setHealthTier] = useState<HealthPlanTier>("NONE")
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

    const [searchTerm, setSearchTerm] = useState("")
    const [examesEncontrados, setExamesEncontrados] = useState<ExamsG[]>([])
    const [selectedExam, setSelectedExam] = useState<ExamsG | null>(null)
    const [consultas, setConsultas] = useState<ConsultaMinha[]>([])
    const [loadingExames, setLoadingExames] = useState(false)
    const [erroExames, setErroExames] = useState("")
    const [selectedConsulta, setSelectedConsulta] = useState<ConsultaMinha | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loadingConsultas, setLoadingConsultas] = useState(false)
    const [examesDaConsulta, setExamesDaConsulta] = useState<ExameEnviado[]>([])
    const [loadingExamesConsulta, setLoadingExamesConsulta] = useState(false)
    const [pedidosExames, setPedidosExames] = useState<PedidoExamePaciente[]>([])
    const [selectedPedidoExame, setSelectedPedidoExame] = useState<PedidoExamePaciente | null>(null)
    const [loadingPedidosExames, setLoadingPedidosExames] = useState(false)
    const [erroPedidosExames, setErroPedidosExames] = useState("")
    const [meusExames, setMeusExames] = useState<ExameEnviado[]>([])
    const [loadingMeusExames, setLoadingMeusExames] = useState(false)

    const canSendExam = Boolean(
        selectedConsulta &&
        selectedFile &&
        (selectedPedidoExame || selectedExam)
    )

    type ExameEnviado = {
        id: number
        pacienteId: number
        medicoId: number
        consultaId: number
        exameGlobalId: number
        nome: string
        descricao: string
        categoria: string
        tipo: string
        arquivoNome: string
        arquivoPath: string
        arquivoTipo: string
        status: string
        criadoEm: string
    }

    useEffect(() => {
        const search = searchTerm.trim()

        if (search.length < 2) {
            setExamesEncontrados([])
            setErroExames("")
            setLoadingExames(false)
            return
        }

        const timer = setTimeout(async () => {
            setLoadingExames(true)
            setErroExames("")

            try {
                const data = await searchExamsG(search)

                console.log("EXAMES G DATA:", data)

                if (!data.success) {
                    setExamesEncontrados([])
                    setErroExames(data.message || "Erro ao buscar exames")
                    return
                }

                setExamesEncontrados(data.exames || [])
            } catch (error) {
                console.log("ERRO AO BUSCAR EXAMES:", error)
                setExamesEncontrados([])
                setErroExames("Erro ao conectar com o servidor")
            } finally {
                setLoadingExames(false)
            }
        }, 350)

        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        async function loadConsultas() {
            setLoadingConsultas(true)

            try {
                const data = await getMinhasConsultas()

                console.log("EXAMES CONSULTAS:", data)

                if (!data.success) {
                    console.log("ERRO CONSULTAS:", data.message)
                    setConsultas([])
                    return
                }

                const consultasRecebidas: ConsultaMinha[] = data.consultas || []

                console.log("CONSULTAS RECEBIDAS:", consultasRecebidas)

                const consultasConfirmadas = consultasRecebidas.filter((consulta) =>
                    consulta.status?.toUpperCase() === "CONFIRMADA"
                )

                console.log("CONSULTAS CONFIRMADAS:", consultasConfirmadas)

                setConsultas(consultasConfirmadas)
            } catch (error) {
                console.log("ERRO AO BUSCAR CONSULTAS EM EXAMES:", error)
                setConsultas([])
            } finally {
                setLoadingConsultas(false)
            }
        }

        loadConsultas()
    }, [])

    function handleSelectExam(exame: ExamsG) {
        setSelectedExam(exame)
        setSearchTerm(exame.nome)
        setExamesEncontrados([])
        setErroExames("")
    }

    function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null
        setSelectedFile(file)
    }

    async function handleRequestExam() {
        if (!selectedExam || !selectedConsulta) {
            console.log("Selecione uma consulta e um exame antes de pedir.")
            return
        }

        try {
            const data = await criarPedidoExame({
                exameGlobalId: selectedExam.id,
                consultaId: selectedConsulta.id,
            })

            console.log("RESPOSTA PEDIDO EXAME:", data)

            if (!data.success) {
                console.log(data.message || "Erro ao pedir exame")
                return
            }

            console.log("EXAME PEDIDO COM SUCESSO")
        } catch (error) {
            console.log("ERRO AO PEDIR EXAME:", error)
        }
    }

    async function handleSendExam() {
        if (!selectedPedidoExame || !selectedConsulta || !selectedFile) {
            console.log("Selecione um pedido de exame, uma consulta e um arquivo antes de enviar.")
            return
        }

        try {
            const data = await enviarExamePaciente({
                pedidoExameId: selectedPedidoExame.id,
                exameGlobalId: selectedPedidoExame.exameGlobalId,
                consultaId: selectedConsulta.id,
                arquivo: selectedFile,
            })

            console.log("RESPOSTA ENVIO EXAME:", data)

            if (!data.success) {
                console.log(data.message || "Erro ao enviar exame")
                return
            }

            console.log("EXAME ENVIADO COM SUCESSO")

            setPedidosExames((prev) =>
                prev.filter((pedido) => pedido.id !== selectedPedidoExame.id)
            )

            if (data.exame) {
                setExamesDaConsulta((prev) => [data.exame, ...prev])
            }

            setSelectedFile(null)
            setSelectedPedidoExame(null)
            setSelectedExam(null)
            setSearchTerm("")
            setExamesEncontrados([])
        } catch (error) {
            console.log("ERRO AO ENVIAR EXAME:", error)
        }
    }
        
    const isMedic = user.role?.toUpperCase() === "MEDICO"
    const isPacient = user.role?.toUpperCase() === "PACIENTE"

    const [activeExamTab, setActiveExamTab] = useState<"pedidos" | "meus">("pedidos")


    useEffect(() => {
        async function loadPedidosExamesConsulta() {
            if (!selectedConsulta) {
                setPedidosExames([])
                setSelectedPedidoExame(null)
                setErroPedidosExames("")
                return
            }

            setLoadingPedidosExames(true)
            setErroPedidosExames("")
            setSelectedPedidoExame(null)

            try {
                const data = await getPedidosExamesDaConsulta(selectedConsulta.id)

                console.log("PEDIDOS DE EXAMES DA CONSULTA:", data)

                if (!data.success) {
                    setPedidosExames([])
                    setErroPedidosExames(data.message || "Erro ao buscar exames pedidos")
                    return
                }

                setPedidosExames(data.pedidos || [])
            } catch (error) {
                console.log("ERRO AO BUSCAR PEDIDOS DE EXAMES:", error)
                setPedidosExames([])
                setErroPedidosExames("Erro ao conectar com o servidor")
            } finally {
                setLoadingPedidosExames(false)
            }
        }

        loadPedidosExamesConsulta()
    }, [selectedConsulta])


    const pedidosPendentes = pedidosExames.filter(
        (pedido) => pedido.status !== "ENVIADO"
    )

    useEffect(() => {
        async function loadExamesDaConsulta() {
            if (!selectedConsulta) {
                setExamesDaConsulta([])
                return
            }

            setLoadingExamesConsulta(true)

            try {
                const data = await getExamesDaConsulta(selectedConsulta.id)

                console.log("EXAMES DA CONSULTA:", data)

                if (!data.success) {
                    setExamesDaConsulta([])
                    return
                }

                setExamesDaConsulta(data.exames || [])
            } catch (error) {
                console.log("ERRO AO BUSCAR EXAMES DA CONSULTA:", error)
                setExamesDaConsulta([])
            } finally {
                setLoadingExamesConsulta(false)
            }
        }

        loadExamesDaConsulta()
    }, [selectedConsulta])

    useEffect(() => {
        async function loadMeusExames() {
            if (!isPacient || activeExamTab !== "meus") return

            setLoadingMeusExames(true)

            try {
                const consultasData = await getMinhasConsultas()

                if (!consultasData.success) {
                    setMeusExames([])
                    return
                }

                const consultasRecebidas: ConsultaMinha[] = consultasData.consultas || []

                const respostas = await Promise.all(
                    consultasRecebidas.map((consulta) =>
                        getExamesDaConsulta(consulta.id)
                    )
                )

                const examesJuntados = respostas.flatMap((data) =>
                    data.success ? data.exames || [] : []
                )

                setMeusExames(examesJuntados)
            } catch (error) {
                console.log("ERRO AO CARREGAR MEUS EXAMES:", error)
                setMeusExames([])
            } finally {
                setLoadingMeusExames(false)
            }
        }

        loadMeusExames()
    }, [isPacient, activeExamTab])

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
                <span>&nbsp;</span>
                <span>E</span>
                <span>X</span>
                <span>A</span>
                <span>M</span>
                <span>E</span>
                <span>S</span>
            </span>

            </h1>
        </div>

        <div className="exm-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="exm-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "exm-bell-new-animate" : "" }`}/>

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

    <section className="exams-search-section">
        <div className="search-line">
            <span className="search-line-icon">⌕</span>

            <input
                type="text"
                placeholder="Buscar por médicos, especialidades ou exames..."
                className="search-line-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}/>

            {searchTerm.trim().length >= 2 && (
                <div className="search-exam-dropdown">
                    {loadingExames && (
                        <div className="search-exam-message">
                            Buscando exames...
                        </div>
                    )}

                    {erroExames && (
                        <div className="search-exam-message search-exam-error">
                            {erroExames}
                        </div>
                    )}

                    {!loadingExames &&
                        !erroExames &&
                        examesEncontrados.length === 0 && (
                            <div className="search-exam-message">
                                Nenhum exame encontrado.
                            </div>
                        )}

                    {!loadingExames &&
                        !erroExames &&
                        examesEncontrados.map((exame) => (
                            <button
                                key={exame.id}
                                type="button"
                                className="search-exam-option"
                                onClick={() => handleSelectExam(exame)}>
                            
                                <span className="search-exam-name">
                                    {exame.nome}
                                </span>

                                <span className="search-exam-type">
                                    {exame.categoria}
                                </span>
                            </button>
                        ))}
                </div>
            )}
        </div>
    </section>


    <section className="exams-panel-section">
        {isMedic && (
            <MedExams
                consultas={consultas}
                selectedConsulta={selectedConsulta}
                loadingConsultas={loadingConsultas}
                searchTerm={searchTerm}
                examesEncontrados={examesEncontrados}
                selectedExam={selectedExam}
                loadingExames={loadingExames}
                erroExames={erroExames}
                examesDaConsulta={examesDaConsulta}
                loadingExamesConsulta={loadingExamesConsulta}
                onSelectConsulta={(consulta) => {
                    setSelectedConsulta((prev) =>
                        prev?.id === consulta.id ? null : consulta
                    )
                }}
                onSearchTermChange={setSearchTerm}
                onSelectExam={handleSelectExam}
                onRequestExam={handleRequestExam}/>
        )}

    {isPacient && (
        <div className="exm-patient-panel">
            <div className="exm-tabs">
                <button
                    type="button"
                    className={`exm-tab-requested ${
                        activeExamTab === "pedidos" ? "exm-tab-active" : ""
                    }`}
                    onClick={() => {
                        setActiveExamTab("pedidos")
                        setSelectedFile(null)
                    }}>
                
                    EXAMES PEDIDOS
                </button>

                <button
                    type="button"
                    className={`exm-tab-my ${
                        activeExamTab === "meus" ? "exm-tab-active" : ""
                    }`}
                    onClick={() => {
                        setActiveExamTab("meus")
                        setSelectedExam(null)
                        setSelectedConsulta(null)
                        setSelectedFile(null)
                        setExamesEncontrados([])
                        setErroExames("")
                    }}>
                
                    MEUS EXAMES
                </button>
            </div>

        {activeExamTab === "pedidos" && (
            <section className="exm-requested-section">


                <div className="exm-requested-left">
                    <div className="exm-panel-card-header">
                        <div>
                            <h3>Consulta para envio</h3>
                            <p>Selecione a consulta para onde este exame será enviado.</p>
                        </div>

                        <span className="exm-panel-pill">CONSULTAS</span>
                    </div>

                    <div className="exm-consulta-under-list">
                        {loadingConsultas ? (
                            <div className="exm-empty-state">
                                Carregando consultas...
                            </div>
                        ) : consultas.length > 0 ? (
                            consultas.map((consulta) => (
                                <button
                                    key={consulta.id}
                                    type="button"
                                    className={`exm-consulta-under-option ${
                                        selectedConsulta?.id === consulta.id
                                            ? "exm-consulta-under-option-active"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedConsulta((prev) =>
                                            prev?.id === consulta.id ? null : consulta
                                        )
                                        setSelectedFile(null)
                                    }}
                                >
                                    <div className="exm-consulta-under-avatar">
                                        {(consulta.medicoNome || "M").charAt(0).toUpperCase()}
                                    </div>

                                    <div className="exm-consulta-under-main">
                                        <strong>{consulta.medicoNome}</strong>

                                        <span>
                                            {consulta.especialidade || consulta.motivo}
                                        </span>
                                    </div>

                                    <div className="exm-consulta-under-meta">
                                        <strong>{consulta.hora?.slice(0, 5)}</strong>
                                        <span>{consulta.data}</span>
                                    </div>

                                    <span className="exm-consulta-under-arrow">›</span>
                                </button>
                            ))
                        ) : (
                            <div className="exm-empty-state">
                                Nenhuma consulta confirmada encontrada.
                            </div>
                        )}
                    </div>

                    <div className="exm-selected-exam-view">
                        <div className="exm-selected-exam-header">
                            <h3>Exame escolhido</h3>
                            <span>{selectedExam ? "ATIVO" : "VAZIO"}</span>
                        </div>

                        {selectedExam ? (
                            <div className="exm-selected-exam-card">
                                <div className="exm-selected-exam-icon">
                                    🧪
                                </div>

                                <div className="exm-selected-exam-info">
                                    <strong>{selectedExam.nome}</strong>

                                    <span>
                                        {selectedExam.categoria} • {selectedExam.tipo}
                                    </span>

                                    <small>
                                        Exame selecionado pela busca superior.
                                    </small>
                                </div>
                            </div>
                        ) : (
                            <div className="exm-empty-state">
                                Nenhum exame escolhido. Use a busca superior para selecionar.
                            </div>
                        )}
                    </div>
                </div>



                <div className="exm-requested-right">
                    <div className="exm-selected-card">
                        <div className="exm-panel-card-header">
                            <div>
                                <h3>Exames pedidos</h3>
                                <p>Exames solicitados pela médica na consulta selecionada.</p>
                            </div>

                            <span className="exm-panel-pill">PEDIDOS</span>
                        </div>

                        <div className="exm-doctor-request-list">
                            {!selectedConsulta ? (
                                <div className="exm-selected-destination-empty">
                                    Selecione uma consulta para ver os exames pedidos.
                                </div>
                            ) : loadingPedidosExames ? (
                                <div className="exm-selected-destination-empty">
                                    Carregando exames pedidos...
                                </div>
                            ) : erroPedidosExames ? (
                                <div className="exm-selected-destination-empty">
                                    {erroPedidosExames}
                                </div>
                            ) : pedidosPendentes.length > 0 ? (
                                pedidosPendentes.map((pendente) => (
                                    <button
                                        key={pendente.id}
                                        type="button"
                                        className={`exm-doctor-request-card ${
                                            selectedPedidoExame?.id === pendente.id
                                                ? "exm-doctor-request-card-active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedPedidoExame((prev) =>
                                                prev?.id === pendente.id ? null : pendente
                                            )
                                        }}>
                                    
                                        <div className="exm-doctor-request-icon">
                                            <span>🧪</span>
                                        </div>

                                        <div className="exm-doctor-request-main">
                                            <strong>{pendente.nome}</strong>

                                            <span>
                                                {pendente.categoria} • {pendente.tipo}
                                            </span>
                                        </div>

                                        <div className="exm-doctor-request-meta">
                                            <span>{pendente.status || "Pendente"}</span>
                                        </div>

                                        <span className="exm-doctor-request-arrow">›</span>
                                    </button>
                                ))
                            ) : (
                                <div className="exm-selected-destination-empty">
                                    Nenhum exame foi pedido para essa consulta.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="exm-upload-card">
                        <div className="exm-panel-card-header">
                            <div>
                                <h3>Enviar resultado</h3>
                                <p>Anexe o arquivo referente ao exame pedido selecionado.</p>
                            </div>

                            <span className="exm-panel-pill exm-panel-pill-file">
                                ARQUIVO
                            </span>
                        </div>

                        <label className="exm-upload-box">
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleSelectFile}/>
                            

                            <span className="exm-upload-icon">↥</span>

                            <strong>
                                {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                            </strong>

                            <small>
                                {selectedPedidoExame
                                    ? `Resultado para: ${selectedPedidoExame.nome}`
                                    : "Selecione um exame pedido acima"}
                            </small>
                        </label>

                        <button
                            type="button"
                            className={`exm-send-button ${
                                !canSendExam ? "exm-send-disabled" : ""
                            }`}
                            disabled={!canSendExam}
                            onClick={handleSendExam}>
                        
                            ENVIAR EXAME
                        </button>
                    </div>
                </div>
            </section>
        )}



{activeExamTab === "meus" && (
    <section className="exm-my-section exm-my-section-single">
        <div className="exm-my-left exm-my-full">
            <div className="exm-panel-card-header">
                <div>
                    <h3>Meus exames</h3>
                    <p>Resultados enviados e armazenados na sua conta.</p>
                </div>

                <span className="exm-panel-pill">HISTÓRICO</span>
            </div>

            <div className="exm-my-list">
                {loadingMeusExames ? (
                    <div className="exm-empty-state">
                        Carregando exames enviados...
                    </div>
                ) : meusExames.length > 0 ? (
                    meusExames.map((exame) => (
                        <div
                            key={exame.id}
                            className="exm-my-card"
                        >
                            <div className="exm-my-icon">
                                <span>📄</span>
                            </div>

                            <div className="exm-my-main">
                                <strong>{exame.nome}</strong>

                                <span>
                                    {exame.categoria} • {exame.status}
                                </span>

                                <small>
                                    {exame.arquivoNome || "Arquivo sem nome"}
                                </small>
                            </div>

                            <div className="exm-my-meta">
                                <small>
                                    {exame.criadoEm
                                        ? exame.criadoEm.slice(0, 10)
                                        : "Sem data"}
                                </small>

                                {exame.arquivoPath && (
                                    <a
                                        href={getArquivoUrl(exame.arquivoPath)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="exm-my-open-file"
                                    >
                                        ABRIR
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="exm-empty-state">
                        Nenhum exame enviado encontrado.
                    </div>
                )}
            </div>
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