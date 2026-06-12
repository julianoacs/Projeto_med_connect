"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Especialidades() {

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
            className="
            object-contain rounded-md
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

        <div className="w-1/5 flex justify-end ml-auto mb-12">
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

</main>

  )
}