"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
  
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
        email: email,
        senha: password,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.log(data.message)
        alert(data.message || "Email ou senha inválidos")
        return
      }

      console.log("Login realizado:", data.usuario)

      router.push("/home")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      alert("Erro ao conectar com o servidor")
    }
  }

  return (
    <main className="min-h-screen bg-gray-200 font-sans flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-md w-[500px] p-10 relative overflow-hidden">

        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, #2a9d8a, transparent)",
          }}/>

        <div className="relative z-10">

          {/* Logo */}
          <div
            onClick={() => router.push("/landing")}
            className="flex items-center gap-3 cursor-pointer mb-8"
          >
            <Image
              src="/images/landing/telemed.png"
              alt="logo"
              width={60}
              height={60}
              className="object-contain"/>

            <span className="text-2xl font-bold text-[#2a9d8a]">
              MED CONNECT
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#2a9d8a]">
            Entrar
          </h1>

          <p className="text-gray-600 mb-6">
            Acesse sua conta para agendar consultas
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                border border-[#2a9d8a]/30
                rounded-lg px-4 py-3
                outline-none
                text-[#2a9d8a]
                placeholder:text-gray-400
                focus:border-[#2a9d8a]
                focus:ring-2 focus:ring-[#2a9d8a]/30
                transition
              "
              required
            />

            {/* SENHA COM OLHO */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  border border-[#2a9d8a]/30
                  rounded-lg px-4 py-3 pr-14
                  outline-none
                  text-[#2a9d8a]
                  placeholder:text-gray-400
                  focus:border-[#2a9d8a]
                  focus:ring-2 focus:ring-[#2a9d8a]/30
                  transition
                "
                required
              />

              {/* BOTÃO OLHO */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  w-8 h-8
                  flex items-center justify-center
                  rounded-lg
                  text-gray-500 hover:text-[#2a9d8a]
                  transition">

                {showPassword ? (
                  // olho fechado
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.06-2.37 2.89-4.32 5.14-5.5M9.9 4.24A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7a10.96 10.96 0 0 1-2.16 3.19M1 1l22 22"/>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">

                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>

                )}
              </button>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="
                bg-[#2a9d8a]
                text-white
                py-3 rounded-lg
                font-semibold
                transition
                hover:scale-[1.02]
                hover:brightness-110">

              Entrar
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <button className="hover:text-[#2a9d8a] transition">
              Esqueci minha senha
            </button>

            <button
              onClick={() => router.push("/cadastro")}
              className="hover:text-[#2a9d8a] transition"
            >
              Criar conta
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}