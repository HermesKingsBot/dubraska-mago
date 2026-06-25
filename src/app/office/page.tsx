"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/OfficeAuthContext"

function OfficeLoginPage(): React.JSX.Element {
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/office/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (cardRef.current) {
      import("gsap").then(({ default: gsap }) => {
        gsap.fromTo(
          cardRef.current!,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.replace("/office/dashboard")
    } else {
      setError(result.error || "Credenciales incorrectas. Intenta de nuevo.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
      <div
        ref={cardRef}
        className="bg-[#111] border border-[var(--color-gold)]/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold text-[var(--color-gold)] tracking-wider"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            DUBRASKA MAGO®
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors disabled:opacity-50"
              placeholder="admin@dubraskamago.com"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2.5 pr-10 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white text-sm"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-black transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #B8960C)",
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OfficeLoginPage
