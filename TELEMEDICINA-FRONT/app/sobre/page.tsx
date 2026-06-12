"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import "./header.css"

export default function SobreNos() {
    const router = useRouter()

    return (
        <main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden py-10">
            {/* Header Responsivo - Removido mx-[200px] e grid rígido */}
            <header className="header-shell z-20 grid grid-cols-3 items-center h-[100px] bg-white rounded-2xl shadow-md mx-[200px] px-[50px]">
                    <button
                        type="button"
                        onClick={() => router.push("/landing")}
                        className="header-brand group inline-flex w-fit items-center gap-4 cursor-pointer rounded-2xl px-3 py-2
                        transition-all duration-300
                        hover:hover:scale-[1.1]
                        active:scale-[0.99]">

                        <Image
                            src="/images/telemed.png"
                            alt="Logo Connect"
                            width={88}
                            height={88}
                            className=" object-contain rounded-md
                            transition-all duration-300
                            group-hover:scale-[1.03]"
                            priority/>

                        <span
                            className="text-4xl font-bold text-[#2a9d8a]
                            transition-all duration-300
                            group-hover:text-[#2a9d8a]">
                            
                            MED CONNECT
                        </span>
                    </button>

                    <div className="header-nav flex justify-center text-xl">
                        <button
                            type="button"
                            onClick={() => router.push("/sobre")}
                            className="sobre-button group relative px-8 py-3 text-black transition-all duration-300 hover:text-[#2a9d8a]" >
                    
                            <span className="relative z-10 font-medium whitespace-nowrap">
                                Sobre Nós
                            </span>

                            <span className="absolute left-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
                            <span className="absolute right-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
                        </button>
                    </div>

                    <div className="w-1/5 flex justify-end ml-auto mb-13">
                        <button 
                            type="button" 
                            onClick={() => router.push("/login")} 
                            className="absolute overflow-hidden flex rounded-xl bg-[#2a9d8a] text-white shadow-md px-7 py-3 whitespace-nowrap
                            transition-all duration-300
                            hover:scale-[1.02]
                            before:absolute before:inset-0
                            before:bg-white/0
                            before:transition-all before:duration-300
                            hover:before:bg-white/15">

                            <span className="relative z-10">Agendar consulta gratuita</span>
                        </button>
                    </div>
            </header>

            {/* Seção Principal - Agora usa a classe main-card para alinhar com o header */}
            <section className="main-card relative flex flex-col md:flex-row rounded-2xl bg-white shadow-lg min-h-[550px] mt-10 overflow-hidden">
                <div className="flex flex-col justify-center p-10 md:p-20 lg:w-[60%] z-10">
                    <h2 className="text-5xl font-bold text-[#2a9d8a] mb-2">Nossa História</h2>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-8">Democratizando a Saúde de Qualidade</h3>
                    
                    <div className="space-y-6 text-lg text-black/80 leading-relaxed">
                        <p>
                            O <strong>Med Connect</strong> nasceu da convicção de que a tecnologia deve ser uma ponte para o cuidado humanizado.
                        </p>
                        <p>
                            Iniciado como um projeto acadêmico focado em superar barreiras, evoluímos para uma plataforma que conecta pacientes a especialistas em telemedicina com rapidez, segurança e acessibilidade total, direto do conforto de casa.
                        </p>
                    </div>
                </div>

                <div className="relative h-64 md:h-auto md:flex-1">
                    <div className="absolute inset-0" 
                         style={{ 
                             maskImage: "linear-gradient(to left, black 75%, transparent 100%)", 
                             WebkitMaskImage: "linear-gradient(to left, black 75%, transparent 100%)" 
                         }}>
                        <Image 
                            src="/images/landing/back.png" 
                            alt="Equipe Médica" 
                            fill 
                            className="object-cover brightness-100 saturate-50"
                        />
                        <div className="absolute inset-0 bg-[#2a9d8a]/5" />
                    </div>
                </div>
            </section>

            {/* Grid de Valores - Também usando main-card para manter o alinhamento vertical */}
            <section className="main-card mt-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <div className="bg-white rounded-2xl shadow-md p-8 flex items-center gap-5 border-l-4 border-[#2a9d8a]">
                        <div className="text-4xl">🎯</div>
                        <div>
                            <h4 className="font-bold text-xl">Nossa Missão</h4>
                            <p className="text-sm text-gray-600">Consultas gratuitas e acessíveis para todos.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8 flex items-center gap-5 border-l-4 border-[#2a9d8a]">
                        <div className="text-4xl">🚀</div>
                        <div>
                            <h4 className="font-bold text-xl">Nossa Visão</h4>
                            <p className="text-sm text-gray-600">Sua consulta online em poucos minutos.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8 flex items-center gap-5 border-l-4 border-[#2a9d8a]">
                        <div className="text-4xl">🤝</div>
                        <div>
                            <h4 className="font-bold text-xl">Nossos Valores</h4>
                            <p className="text-sm text-gray-600">Atendimento privado com médicos qualificados.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
