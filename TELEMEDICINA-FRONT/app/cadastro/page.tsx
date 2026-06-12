"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import './input.css'

type FormData = {
  nome?: string
  email?: string
  telefone?: string
  senha?: string
  confirmarSenha?: string
  historico?: string
  alergias?: string
  crm?: string
  especialidade?: string
  universidade?: string
}

export default function Cadastro() {
  const router = useRouter()

  const [tipoUsuario, setTipoUsuario] = useState<"paciente" | "medico">("paciente")
  const [form, setForm] = useState<FormData>({})

  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!")
      return
    }

    console.log({ tipoUsuario, ...form })
  }

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-md w-[600px] p-10 relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#2a9d8a] to-transparent" />

        <div className="relative z-10">

          {/* Logo */}
          <div
            onClick={() => router.push("/landing")}
            className="flex items-center gap-3 cursor-pointer mb-8"
          >
            <Image src="/images/landing/telemed.png" alt="logo" width={60} height={60} />
            <span className="text-2xl font-bold text-[#2a9d8a]">
              MED CONNECT
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#2a9d8a] mb-6">
            Criar Conta
          </h1>

          {/* Abas */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => {
                setTipoUsuario("paciente")
                setForm({})
              }}
              className={`flex-1 py-2 font-semibold ${
                tipoUsuario === "paciente"
                  ? "text-[#2a9d8a] border-b-2 border-[#2a9d8a]"
                  : "text-gray-400"
              }`}
            >
              Paciente
            </button>
            
            <button
              onClick={() => {
                setTipoUsuario("medico")
                setForm({})
              }}
              className= {`flex-1 py-2 font-semibold ${
                tipoUsuario === "medico"
                  ? "text-[#2a9d8a] border-b-2 border-[#2a9d8a]"
                  : "text-gray-400"
              }`}
            >
              Médico
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input name="nome" placeholder="Nome completo" onChange={handleChange} className="input" required />
            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} className="input" required />
            <input name="telefone" placeholder="Telefone" onChange={handleChange} className="input" required />

            {/* SENHA */}
            <div className="relative">
              <input
                type={showSenha ? "text" : "password"}
                name="senha"
                placeholder="Senha"
                onChange={handleChange}
                className="input w-full pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a9d8a] transition"
              >
                {showSenha ? (
                  // olho fechado
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/>
                    <path d="M1 1l18 18" />
                  </svg>
                ) : (
                  // olho aberto
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="relative">
              <input
                type={showConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                placeholder="Confirmar senha"
                onChange={handleChange}
                className="input w-full pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a9d8a] transition"
              >
                {showConfirmarSenha ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/>
                    <path d="M1 1l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/>
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* CAMPOS DINÂMICOS */}
            {tipoUsuario === "paciente" && (
              <>
                <textarea name="historico" placeholder="Histórico médico" onChange={handleChange} className="input h-[100px]" />
                <input name="alergias" placeholder="Alergias" onChange={handleChange} className="input" />
              </>
            )}

            {tipoUsuario === "medico" && (
              <>
                <input name="crm" placeholder="CRM" onChange={handleChange} className="input" required />
                <input name="especialidade" placeholder="Especialidade" onChange={handleChange} className="input" required />
                <input name="universidade" placeholder="Universidade" onChange={handleChange} className="input" required />
              </>
            )}

            <button className="bg-[#2a9d8a] text-white py-3 rounded-lg font-semibold hover:scale-[1.02]">
              Criar conta
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Já tem conta?{" "}
            <span onClick={() => router.push("/login")} className="text-[#2a9d8a] cursor-pointer">
              Entrar
            </span>
          </p>

        </div>
      </div>

    </main>
  )
}