"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const subjects = [
  "Pedido personalizado",
  "Consulta",
  "Colaboración",
  "Otro",
]

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactFormProps {
  form: FormData
  submitted: boolean
  errors: Partial<Record<keyof FormData, string>>
  onChange: (field: keyof FormData, value: string) => void
  onSubmit: (ev: React.FormEvent) => void
  ref?: React.Ref<HTMLDivElement>
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  error?: string
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        animate={{
          y: isActive ? -22 : 0,
          scale: isActive ? 0.85 : 1,
          color: focused ? "var(--color-gold)" : "rgba(255,255,255,0.5)",
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 top-3 origin-left pointer-events-none text-sm"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className="w-full rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72_0.16_85)] placeholder:text-white/20 pt-5"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-xs text-red-400"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (val: string) => void
  error?: string
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        animate={{
          y: isActive ? -22 : 0,
          scale: isActive ? 0.85 : 1,
          color: focused ? "var(--color-gold)" : "rgba(255,255,255,0.5)",
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 top-3 origin-left pointer-events-none text-sm"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </motion.label>
      <textarea
        id={id}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className="w-full resize-none rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72_0.16_85)] placeholder:text-white/20 pt-5"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-xs text-red-400"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContactForm({ form, submitted, errors, onChange, onSubmit, ref }: ContactFormProps): React.JSX.Element {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    setSubmitting(true)
    setTimeout(() => {
      onSubmit(e)
      setSubmitting(false)
    }, 1200)
  }

  return (
    <section ref={ref} className="px-6 pb-20 md:pb-28 max-w-3xl mx-auto opacity-0">
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Escríbenos
      </h2>
      <p
        className="text-center text-[var(--color-muted)] mb-12 text-sm sm:text-base"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Completa el formulario y te responderemos lo antes posible.
      </p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-dark-card)] p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10"
            >
              <motion.svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>
            <h3
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ¡Mensaje enviado!
            </h3>
            <p className="text-[var(--color-muted)] text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Gracias por contactarnos. Te responderemos pronto.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FloatingInput
              id="name"
              label="Nombre *"
              value={form.name}
              onChange={(val) => onChange("name", val)}
              error={errors.name}
              placeholder="Tu nombre"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FloatingInput
                id="email"
                label="Email *"
                type="email"
                value={form.email}
                onChange={(val) => onChange("email", val)}
                error={errors.email}
                placeholder="tu@email.com"
              />
              <FloatingInput
                id="phone"
                label="Teléfono"
                type="tel"
                value={form.phone}
                onChange={(val) => onChange("phone", val)}
                placeholder="+58 412 000 0000"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Asunto *
              </label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => onChange("subject", e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72_0.16_85)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <option value="" disabled>
                  Selecciona un asunto
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-[var(--color-dark-card)] text-white">
                    {s}
                  </option>
                ))}
              </select>
              <AnimatePresence>
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-xs text-red-400"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <FloatingTextarea
              id="message"
              label="Mensaje *"
              value={form.message}
              onChange={(val) => onChange("message", val)}
              error={errors.message}
              placeholder="Cuéntanos en qué podemos ayudarte..."
            />

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full rounded-xl px-8 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.72_0.16_85)] disabled:opacity-70"
              style={{
                fontFamily: "var(--font-dm-sans)",
                background: "linear-gradient(135deg, var(--color-gold) 0%, #B8941F 100%)",
                color: "var(--color-bg)",
              }}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  </motion.span>
                  Enviando...
                </span>
              ) : (
                "Enviar Mensaje"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ContactForm
