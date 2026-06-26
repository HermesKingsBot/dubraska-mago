"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCustomerAuth } from "@/context/CustomerAuthContext"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useCustomerAuth()

  const redirectTo = searchParams.get("redirect") || "/cuenta"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio")
      return
    }
    if (!password) {
      setError("La contraseña es obligatoria")
      return
    }

    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      router.push(redirectTo)
    } else {
      setError(result.error || "Correo o contraseña incorrectos")
    }
  }

  const handleForgotPassword = () => {
    alert("Función de recuperación de contraseña no disponible aún. Contáctanos para asistencia.")
  }

  return (
    <div className="bg-[var(--color-dark-card)] rounded-2xl p-8 border border-[var(--color-dark-accent)]">
      <h2 className="text-xl font-light text-[var(--color-white)] mb-6 text-center"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Iniciar Sesión
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/30 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            placeholder="tu@correo.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[var(--color-gold)] text-[var(--color-bg)] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-muted)]">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-[var(--color-gold)] hover:opacity-80 transition-opacity"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]" />}>
      <LoginForm />
    </Suspense>
  )
}
