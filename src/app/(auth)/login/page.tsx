"use client"

import { useState, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import { motion, AnimatePresence } from "motion/react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useCustomerAuth()
  const errorRef = useRef<HTMLDivElement>(null)

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-dark-card)] rounded-2xl p-8 border border-[var(--color-dark-accent)]"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-light text-[var(--color-white)] mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Iniciar Sesión
      </motion.h2>

      <AnimatePresence>
        {error && (
          <motion.div
            ref={errorRef}
            initial={{ opacity: 0, x: -10, height: 0 }}
            animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0], height: "auto" }}
            exit={{ opacity: 0, x: -10, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/30 text-red-300 text-sm text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all text-sm"
            placeholder="tu@correo.com"
            autoComplete="email"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all text-sm"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-right"
        >
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-[var(--color-gold)] text-[var(--color-bg)] font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider relative overflow-hidden"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </motion.button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[var(--color-muted)]">o</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-[var(--color-muted)]">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-[var(--color-gold)] hover:opacity-80 transition-opacity"
          >
            Regístrate
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]" />}>
      <LoginForm />
    </Suspense>
  )
}
