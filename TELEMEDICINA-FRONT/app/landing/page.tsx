"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import './carousel.css'
import './header.css'
import './principal.css'

export default function Landing() {

    const router = useRouter()

    const [cards, setCards] = useState([
        {
            id: 1,
            name: "Dr. Henrique Souza",
            specialty: "Cardiologista",
            description: "Acompanhamento cardíaco, pressão arterial e prevenção cardiovascular.",
            image: "/images/landing/images/cardio.png",
            alt: "Médico cardiologista",
        },
        {
            id: 2,
            name: "Dr. Marcos Rocha",
            specialty: "Clínico Geral",
            description: "Atendimento inicial, check-ups e orientação para sua saúde no dia a dia.",
            image: "/images/landing/images/geral.png",
            alt: "Médico clínico geral",
        },        
        {
            id: 3,
            name: "Dr. Arthur Lima",
            specialty: "Nutrologista",
            description: "Orientação nutricional, metabolismo e hábitos para mais saúde no dia a dia.",
            image: "/images/landing/images/1.png",
            alt: "Médico Nutricionista",
        },
    ])

    const visibleCards = cards.slice(0, 3)

    const nextCard = () => {
        setCards((prev) => [...prev.slice(1), prev[0]])
    }

    const prevCard = () => {
        setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
    }

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

        <div className="header-nav-land flex justify-center text-xl">
            <button
                type="button"
                onClick={() => router.push("/sobre")}
                className=".sobre-button-land group relative px-8 py-3 text-black transition-all duration-300 hover:text-[#2a9d8a]" >
        
                <span className="class-land relative z-10 font-medium whitespace-nowrap">
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

    
    <section className="card-contender relative overflow-hidden flex rounded-2xl bg-white shadow-md h-[500px] mt-3 mx-50">
        
        <div className="grid grid-cols-2 items-center min-h-[360px] px-[70px] w-full">

           <h1 className="text-[60px] font-bold text-[#000000] mt-5 leading-[1.3] whitespace-nowrap">
                Agende sua consulta
            </h1>

            <h2 className="col-start-1 text-[30px] mb-50 font-light text-[#000000] leading-[1.3] w-[600px] ">
                Fale com especialistas de saúde sem qualquer custo do conforto da sua casa.
            </h2>

            <div
                className="absolute right-0 top-0 h-full w-[50%] overflow-hidden rounded-r-2xl"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to left, black 45%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to left, black 58%, transparent 100%)",
                }}
            >
                <Image
                  src="/images/landing/back.png"
                  alt="Fundo médico"
                  fill
                  sizes="590"
                  className="object-cover scale-105 blur-[7px] brightness-100 saturate-65"
                  priority/>
            
                <div className="absolute  inset-0 bg-[#2a9d8a]/20" />
            </div>
        </div>

            <div className="class-medic z-20 flex justify-end items-end">
                <Image
                  src="/images/landing/med.png"
                  alt="Médica"
                  width={430}
                  height={470}
                  className="object-contain w-150 h-150"
                  priority
                />
            </div>
    </section>


    <section className="h-[130px] mx-50 mt-2">
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

                <span className="text-[15px] text-black/70 leading-[1] mt-2 max-w-[520px]">
                    Agende consultas gratuitas e acessível para todos.
                </span>
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
    

    <section className="carousel-section relative overflow-hidden">
        <div className="carousel-row flex items-start gap-10">
            
            <button
                type="button"
                onClick={prevCard}
                className="carousel-arrow group relative w-[50px] h-[50px] rounded-full bg-white border border-[#dce9e6] flex items-center justify-center
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
    <div
        key={card.id}
        className="carousel-card-container relative bg-white rounded-2xl shadow-md shrink-0 overflow-hidden flex items-center px-6"
    >
        <div
            className="carousel-card-bg pointer-events-none absolute right-0 top-0 h-full w-[58%] overflow-hidden"
            style={{
                WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
                maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            }}
        >
            <Image
                src="/images/landing/back.png"
                alt=""
                fill
                sizes="290px"
                className="object-cover scale-110 blur-[5px] brightness-95 saturate-75"
            />

            <div className="absolute inset-0 bg-[#2a9d8a]/20" />
        </div>

        <div className="carousel-card-content relative z-20 flex flex-col justify-center h-full">
            <h2 className="text-[20px] font-black text-slate-800 leading-[1.1]">
                {card.name}
            </h2>

            <p className="text-[18px] font-bold text-[#2a9d8a] mt-1">
                {card.specialty}
            </p>

            <p className="carousel-card-description">
                {card.description}
            </p>

            <div className="mt-5 ml-[-10px]">
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="rounded-xl bg-[#2a9d8a] text-white shadow-md px-7 py-3 whitespace-nowrap transition-all duration-300 hover:scale-[1.02]"
                >
                    Agendar consulta
                </button>
            </div>
        </div>

        <div className="carousel-doctor-image-wrap">
            <Image
                src={card.image}
                alt={card.alt}
                width={210}
                height={250}
                className="carousel-doctor-image"
            />
        </div>
    </div>
))}

            <button
                type="button"
                onClick={nextCard}
                className="carousel-arrow group relative w-[52px] h-[52px] rounded-full bg-white border border-[#dce9e6] 
                flex items-center justify-center
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

    </main>
  )
}