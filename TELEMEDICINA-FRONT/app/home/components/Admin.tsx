"use client"

import { useRouter } from "next/navigation"

import './admin.css'

type AdminProps = {
    alt: string
}

export default function Admin({ alt }: AdminProps) {
    const router = useRouter()

return (
    <div className="admin-card">
        <div className="admin-card-img">
            <img
                src="/images/home/images/PACIENT.png"
                alt={alt}
                className="admin-image"/>
            
        </div>

        <div className="admin-card-text">
            <h1 className="admin-card-title uppercase">
                Pacientes
            </h1>

            <p className="admin-card-subtext">
                Visualize pacientes cadastrados
            </p>

            <button
                onClick={() => router.push("/pacientes")}
                type="button"
                className="admin-card-button rounded-xl bg-[#2a9d8a] text-white" >
            
                Ver pacientes
            </button>
        </div>
    </div>
    )
}