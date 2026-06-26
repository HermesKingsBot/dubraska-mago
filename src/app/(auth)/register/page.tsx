"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCustomerAuth } from "@/context/CustomerAuthContext"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { register } = useCustomerAuth()

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

  return (
    <div className="bg-[var(--color-dark-card)] rounded-2xl p-8 border border-[var(--color-dark-accent)]">
      <h2 className="text-xl font-light text-[var(--color-white)] mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Crear Cuenta
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/30 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            placeholder="Tu nombre"
            autoComplete="name"
          />
        </div>

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
            Teléfono <span className="text-[var(--color-dark-accent)]">(opcional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            placeholder="+58 412 1234567"
            autoComplete="tel"
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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wider">
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-dark-accent)] rounded-lg text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-start gap-3">
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[var(--color-gold)] text-[var(--color-bg)] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-muted)]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[var(--color-gold)] hover:opacity-80 transition-opacity"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
