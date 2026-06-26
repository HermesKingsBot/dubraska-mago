"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import { motion, AnimatePresence } from "motion/react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [phone, setPhone] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { register } = useCustomerAuth()
  const errorRef = useRef<HTMLDivElement>(null)

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("El nombre es obligatorio")
      return
    }
    if (!email.trim()) {
      setError("El correo electrónico es obligatorio")
      return
    }
    if (!validateEmail(email)) {
      setError("El correo electrónico no es válido")
      return
    }
    if (!password) {
      setError("La contraseña es obligatoria")
      return
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setIsSubmitting(true)
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    })
    setIsSubmitting(false)

    if (result.success) {
      router.push("/cuenta")
    } else {
      setError(result.error || "Error al crear la cuenta")
    }
  }

  const staggerDelay = 0.05

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
        Crear Cuenta
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
          transition={{ delay: 0.1 + staggerDelay * 0 }}
        >
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all text-sm"
            placeholder="Tu nombre"
            autoComplete="name"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + staggerDelay * 1 }}
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
          transition={{ delay: 0.1 + staggerDelay * 2 }}
        >
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Teléfono <span className="text-[var(--color-dark-accent)]">(opcional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all text-sm"
            placeholder="+58 412 1234567"
            autoComplete="tel"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + staggerDelay * 3 }}
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
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
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
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + staggerDelay * 4 }}
        >
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all text-sm"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white transition-colors"
              aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirm ? (
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
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + staggerDelay * 5 }}
          className="flex items-start gap-3"
        >
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[var(--color-gold)]"
          />
          <label htmlFor="terms" className="text-xs text-[var(--color-muted)] leading-relaxed">
            Acepto los{" "}
            <span className="text-[var(--color-gold)] hover:opacity-80 cursor-pointer">
              términos y condiciones
            </span>
          </label>
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
              Creando cuenta...
            </span>
          ) : (
            "Crear Cuenta"
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
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-[var(--color-muted)]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[var(--color-gold)] hover:opacity-80 transition-opacity"
          >
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
