"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import './header.css'
import './principal.css'
import './cards.css'

export default function ComoFunciona() {

    const router = useRouter()

    useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
        if (event.persisted || nav?.type === "back_forward") {
        window.location.reload()
      }
    }
    
        window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

    return (

<main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden">

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

        <div className="header-nav flex text-xl gap-20">

            <button
                type="button"
                onClick={() => router.push("/como")}
                className="group relative px-8 py-3 text-black transition-all duration-300 hover:text-[#2a9d8a]">
                
                <span className="relative z-10 font-medium whitespace-nowrap">Como Funciona</span>

                <span className="absolute left-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
                <span className="absolute right-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
            </button>

            <button
                type="button"
                onClick={() => router.push("/especialidades")}
                className="group relative px-8 py-3 text-black transition-all duration-300 hover:text-[#2a9d8a]">
                
                <span className="relative z-10 font-medium">Especialidades</span>

                <span className="absolute left-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
                <span className="absolute right-0 top-1/2 w-[2px] h-0 -translate-y-1/2 rounded-full bg-[#2a9d8a] transition-all duration-300 group-hover:h-10" />
            </button>

              <button
                type="button"
                onClick={() => router.push("/sobre")}
                className="group relative px-8 py-3 text-black transition-all duration-300 hover:text-[#2a9d8a]">

                <span className="relative z-10 font-medium whitespace-nowrap">Sobre Nós</span>

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


    <section className="relative overflow-visible flex rounded-2xl bg-white shadow-md h-[600px] mt-5 mx-50">
            
            <div className="absolute right-0 top-0 h-full w-[80%] overflow-hidden rounded-r-2xl"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to left, black 45%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to left, black 58%, transparent 100%)",}}>

                <Image
                  src="/images/landing/back.png"
                  alt="Fundo médico"
                  fill
                  sizes="520"
                  className="object-cover scale-105 blur-[7px] brightness-100 saturate-65"
                  priority
                />
                <div className="absolute inset-0 bg-[#2a9d8a]/20" />
            </div>

            <div className="class-cards absolute bottom-0 z-10 pointer-events-none">
                <Image
                  src="/images/landing/med1.png"
                  alt="Médica"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain"
                  priority
                />
            </div>

            

        <div className="cards-content">
            <div className="cards-row">

                <div className="card-item">
                    <div className="card-number">1</div>
                        <div className="card-box"></div>
                </div>

                <div className="card-item">
                    <div className="card-number">2</div>
                        <div className="card-box"></div>
                </div>
                
                <div className="card-item">
                    <div className="card-number">3</div>
                        <div className="card-box"></div>
                </div>

                <div className="card-item">
                    <div className="card-number">4</div>
                        <div className="card-box"></div>
                </div>

            </div>
        </div>

        <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-30">
        
            <button
                type="button"
                onClick={() => router.push("/login")}
                className="relative overflow-hidden
                flex items-center justify-center
                rounded-[50px] border-2 border-white
                bg-[#2a9d8a] text-white shadow-md
                px-10 py-4 text-[20px] font-semibold whitespace-nowrap
                transition-all duration-300
                hover:scale-[1.02]
                before:absolute before:inset-0
                before:bg-white/0
                before:transition-all before:duration-300
                hover:before:bg-white/15">

                Agendar consulta gratuita
            </button>
        </div>  
    </section>


    <section className="h-[160px] mx-50 mt-8">
            <div className="grid grid-cols-3 gap-10 h-full items-center">
    
                <div className="bg-white rounded-2xl shadow-md h-[120px] flex items-center gap-4">
                    <Image
                        src="/images/landing/icons/money.png"
                        alt="money"
                        width={80}
                        height={80}
                        className="object-contain ml-7" 
                    />
    
                <div className="grid ml-25">
                    <h1 className="text-[26px]  font-bold text-[#000000]">
                        Sem Custo
                    </h1>
    
                    <p className="text-[15px] text-black/70 leading-[1] mt-2 max-w-[520px]">
                        Agende consultas gratuitas e acessível para todos.
                    </p>
                </div>
    
                </div>
    
    
                <div className="bg-white rounded-2xl shadow-md h-[120px] flex items-center gap-4">
                    <Image
                        src="/images/landing/icons/certo.png"
                        alt="certo"
                        width={80}
                        height={80}
                        className="object-contain ml-7" 
                    />
    
                <div className="grid ml-25">
                    <h1 className="text-[26px]  font-bold text-[#000000]">
                        Sem Filas Longas
                    </h1>
                    
    
                    <span className="text-[15px] text-black/70 leading-[1] mt-2 max-w-[520px]">
                        Evite filas e esperar, sua consulta online em poucos minutos.
                    </span>
                </div>
    
                </div>
    
                <div className="bg-white rounded-2xl shadow-md h-[120px] flex items-center gap-4">
                    <Image
                        src="/images/landing/icons/seguro.png"
                        alt="seguro"
                        width={80}
                        height={80}
                        className="object-contain ml-7" 
                    />
    
                <div className="grid ml-25">
                    <h1 className="text-[26px]  font-bold text-[#000000]">
                        Consulta Segura
                    </h1>
    
                    <span className="text-[15px] text-black/70 leading-[1] mt-2 max-w-[520px]">
                        Atendimento remoto e privado com médicos qualificados.
                    </span>
                </div>
    
                </div>
    
    
            </div>
    </section>

</main>
  )
}