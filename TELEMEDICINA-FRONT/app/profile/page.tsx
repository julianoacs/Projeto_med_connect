"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { requiredSession } from "../lib/required"

import {
  API_BASE_URL,
  getHomeData,
  sendActivity,
  getAccessStatus,
  getProfileData,
  updateProfileData,
  uploadProfileAvatar,
} from "../lib/auth"

import './headtext.css'
import './bell.css'
import './profile.css'
import './info.css'
import './info2.css'
import './avatar.css'
import './modal.css'
import './view.css'
import './tabinfo.css'
import './edit.css'

export default function Profile() {

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
    
    const [profileInfo, setProfileInfo] = useState({
        nome: "",
        email: "",
        phone: "",
        city: "",
        dataNascimento: "",
        cpf: "",
        tipo: "",
        especialidade: "",
        tipoRegistro: "",
        numeroRegistro: "",
    })

    const [avatarModalOpen, setAvatarModalOpen] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);

    function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        console.log("ARQUIVO ESCOLHIDO:", file);

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            console.log("Arquivo precisa ser uma imagem");
            return;
        }

        setSelectedAvatarFile(file);

        const reader = new FileReader();

        reader.onloadend = async () => {
            const preview = String(reader.result || "");

            console.log("PREVIEW GERADO:", preview.slice(0, 80));

            setAvatarPreview(preview);
            setAvatarUrl(preview);

            setUser((currentUser) => ({
                ...currentUser,
                avatar: preview,
            }));

            setAvatarUploading(true);

            const data = await uploadProfileAvatar(file);

            console.log("RESPOSTA DO AVATAR:", data);

            setAvatarUploading(false);

            if (!data.success) {
                console.log(data.message);
                return;
            }

            const avatar = `${API_BASE_URL}${data.avatarUrl}`;

            console.log("AVATAR FINAL:", avatar);

            setSelectedAvatarFile(null);
            event.target.value = "";
        };

        reader.readAsDataURL(file);
    }

    const [profileTab, setProfileTab] = useState<"info" | "historic"| "exams" >("info");

    const [isEditing, setIsEditing] = useState(false);
    const [profileInfoBackup, setProfileInfoBackup] = useState(profileInfo)
    
        function formatName(value: string) {
        return value
            .replace(/[0-9]/g, "")
            .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
            .replace(/\s{2,}/g, " ")
            .trimStart()
    }

    function isValidName(value: string) {
        return value.trim().length >= 10
    }

    function formatCpf(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 11)

        return digits
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
    }

    function formatPhone(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 11)

        if (digits.length <= 10) {
            return digits
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2")
        }

        return digits
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
    }

    function formatDate(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 8)

        return digits
            .replace(/^(\d{2})(\d)/, "$1/$2")
            .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    }

    useEffect(() => {
        async function loadProfileData() {
            const profileData = await getProfileData()

            console.log("PROFILE DATA:", profileData)

            if (!profileData.success) {
                console.log(profileData.message)
                return
            }

            const avatar = profileData.info?.avatar || ""

            if (avatar) {
                setAvatarUrl(`${API_BASE_URL}${avatar}`)
            }

    setProfileInfo({
        nome: profileData.info?.nome || "",
        email: profileData.info?.email || "",
        phone: profileData.info?.phone || "",
        city: profileData.info?.city || "",
        dataNascimento: profileData.info?.dataNascimento || "",
        cpf: profileData.info?.cpf || "",
        tipo: profileData.info?.tipo || "",
        especialidade: profileData.info?.especialidade || "",
        tipoRegistro: profileData.info?.tipoRegistro || "",
        numeroRegistro: profileData.info?.numeroRegistro || "",
    })
    }

        loadProfileData()
    }, [])

    const isMedicoProfile =
        (profileInfo.tipo || user.role).toUpperCase() === "MEDICO"

    const registroProfissional =
        profileInfo.tipoRegistro && profileInfo.numeroRegistro
            ? `${profileInfo.tipoRegistro} ${profileInfo.numeroRegistro}`
            : profileInfo.numeroRegistro || "Registro não informado"

    if (checkingSession) {
        return null
    }
    
return (
<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden flex justify-center pt-[30px] pb-[30px]">
  
  <section className="relative h-[1200px] w-[1500px] items-center gap-[10px] rounded-[30px] bg-white/45 p-4 shadow-xl backdrop-blur-xl">
    
    <header className="flex items-start justify-between">

        <div className="ml-[80px] mt-[50px]">
            <h1 className="text-[52px] font-black uppercase tracking-[-1px] text-slate-800">
                MEU{" "}

            <span onClick={() => router.push("/home")} className="med-connect-letters uppercase text-[#2a9d8a]">
                <span>P</span>
                <span>E</span>
                <span>R</span>
                <span>F</span>
                <span>I</span>
                <span>L</span>
            </span>

            </h1>
        </div>

        <div className="prof-bell-container mt-[50px]">
            <div onClick={() => router.push("/notify")} className="prof-circle-bell flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-xl">

                <img
                    src={Bell}
                    alt="Notificações"
                    className=  {`h-[45px] w-[45px] object-contain ${
                    bellState === "new" ? "prof-bell-new-animate" : "" }`}
                />

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
    
    <section className="avatar-card">
        <div className="avatar-container">            
            <div className="avatar-area">
                {avatarUrl || user.avatar ? (
                    <img
                        src={avatarUrl || user.avatar}
                        alt="Foto de perfil"
                        className="avatar-area-img"/>
                ) : (
                    <span className="avatar-area-fallback">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            <button
                type="button"
                className="avatar-edit"
                onClick={() => setAvatarModalOpen(true)}
                aria-label="Alterar foto de perfil">
                <img 
                    src="/images/profile/icons/EDIT.png"
                    alt=""
                    className="avatar-edit-img"/>
            </button>
        </div>

        <div className="Profile-main-cards">
        <div className="Profile-tabs">               
            <button type="button" 
                onClick={() =>  setProfileTab ("info")} 
                className={`info-tab ${profileTab === "info" ? "selected-tab" : ""}`}>
                    <span>INFORMAÇÕES</span>
                    <i className="profile-tab-line left"></i>
                    <i className="profile-tab-line right"></i>
            </button>
        </div> 
            
            {profileTab === "info" && (
            <div className="profile-info-content">

                <div className="profile-info-row">
                <span className="profile-info-label">Nome</span>
                <input className="profile-info-input"
                    value={profileInfo.nome}
                    readOnly={!isEditing}
                    onChange={(e) =>
                        setProfileInfo({
                            ...profileInfo,
                            nome: formatName(e.target.value), 
                        })
                    }/>
                </div>

                <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <input className="profile-info-input"
                    value={profileInfo.email}
                    readOnly={!isEditing}
                    onChange={(e) =>
                        setProfileInfo({
                            ...profileInfo,
                            email: e.target.value, 
                        })
                    }/>
                </div>

                <div className="profile-info-row">
                <span className="profile-info-label">Phone</span>
                <input className="profile-info-input"
                    value={profileInfo.phone}
                    readOnly={!isEditing}
                    onChange={(e) =>
                        setProfileInfo({
                            ...profileInfo,
                            phone: formatPhone(e.target.value), 
                        })
                    }/>
                </div>

                <div className="profile-info-row">
                <span className="profile-info-label">Cidade</span>
                <input className="profile-info-input"
                    value={profileInfo.city}
                    readOnly={!isEditing}
                    onChange={(e) =>
                        setProfileInfo({
                            ...profileInfo,
                            city: e.target.value, 
                        })
                    }/>
                </div>

                <div className="profile-info-row">
                <span className="profile-info-label">Nascimento</span>
                <input className="profile-info-input"
                    value={profileInfo.dataNascimento}
                    readOnly={!isEditing}
                    onChange={(e) =>
                        setProfileInfo({
                            ...profileInfo,
                            dataNascimento: formatDate(e.target.value),
                        })
                    }/>
                </div>

                <div className="profile-info-row">
                    <span className="profile-info-label">
                        {isMedicoProfile ? "Registro" : "CPF"}
                    </span>

                    <input
                        className="profile-info-input"
                        value={isMedicoProfile ? registroProfissional : profileInfo.cpf}
                        readOnly={isMedicoProfile || !isEditing}
                        onChange={(e) => {
                            if (isMedicoProfile) return

                            setProfileInfo({
                                ...profileInfo,
                                cpf: formatCpf(e.target.value),
                            })
                        }}/>
                    
                </div>
            </div>
            )}

        </div>

        <div className="profile-edit-actions">
            {!isEditing && (
                <button type="button"
                    className="profile-edit-button"
                    onClick={() => {
                        setProfileInfoBackup(profileInfo)
                        setIsEditing(true) }}>
                        EDITAR
                </button>
             )}

            {isEditing && (
                    <div className="profile-edit-save-actions">
                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={async () => {
                                if (!isValidName(profileInfo.nome)) {
                                    console.log("Nome precisa ter pelo menos 10 caracteres")
                                    return
                                }

                                const data = await updateProfileData(profileInfo)

                                if (!data.success) {
                                    console.log(data.message)
                                    return
                                }

                                setProfileInfo({
                                    nome: data.info?.nome || profileInfo.nome || "",
                                    email: data.info?.email || profileInfo.email || "",
                                    phone: data.info?.phone || profileInfo.phone || "",
                                    city: data.info?.city || profileInfo.city || "",
                                    dataNascimento: data.info?.dataNascimento || profileInfo.dataNascimento || "",
                                    cpf: data.info?.cpf || profileInfo.cpf || "",
                                    tipo: data.info?.tipo || profileInfo.tipo || "",
                                    especialidade: data.info?.especialidade || profileInfo.especialidade || "",
                                    tipoRegistro: data.info?.tipoRegistro || profileInfo.tipoRegistro || "",
                                    numeroRegistro: data.info?.numeroRegistro || profileInfo.numeroRegistro || "",
                                })
                                setIsEditing(false)
                            }}>   
                            SALVAR
                        </button>

                        <button
                            type="button"
                            className="profile-cancel-button"
                            onClick={() => {
                                setProfileInfo(profileInfoBackup)
                                setIsEditing(false)
                            }}>
                            CANCELAR
                        </button>
                    </div>
                )}
                
        </div>
    </section>

    {avatarModalOpen && (
        <div className="avatar-modal-overlay">
            <div className="avatar-modal">

                <button type="button"
                    className="avatar-modal-close"
                    onClick={() => setAvatarModalOpen(false)}
                    aria-label="Fechar modal">
                    <span className="close-button">x</span>
                </button>
            
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    hidden
                    onChange={handleAvatarChange}/>


                <div className="avatar-modal-preview">
                    <div className="avatar-modal-main-circle">
                        {avatarPreview || avatarUrl || user.avatar ? (
                            <img
                                src={avatarPreview || avatarUrl || user.avatar}
                                alt="Prévia da foto de perfil"
                                className="avatar-modal-main-img"
                            />
                        ) : (
                            <span className="avatar-modal-fallback">
                                {(user.name || "U").charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <button type="button"
                        className="avatar-modal-upload"
                        onClick={() => fileInputRef.current?.click()}>

                        <img
                        src="/images/profile/icons/UPLOAD.png"
                        alt="Foto de perfil"
                        className="avatar-upload-img"/>

                    </button>
                </div>

            </div>
        </div>
    )}

  </section>
</main>
  );
}