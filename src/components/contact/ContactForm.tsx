"use client"

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

function ContactForm({ form, submitted, errors, onChange, onSubmit, ref }: ContactFormProps): React.JSX.Element {
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

      {submitted ? (
        <div className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-dark-card)] p-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3
            className="text-2xl text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¡Mensaje enviado!
          </h3>
          <p className="text-[var(--color-muted)] text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Gracias por contactarnos. Te responderemos pronto.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white/80 mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72 0.16 85)] placeholder:text-white/20"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72 0.16 85)] placeholder:text-white/20"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72 0.16 85)] placeholder:text-white/20"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                placeholder="+58 412 000 0000"
              />
            </div>
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
              className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72 0.16 85)]"
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
            {errors.subject && (
              <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-white/80 mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Mensaje *
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              className="w-full resize-none rounded-xl border border-white/10 bg-[var(--color-dark-card)] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[var(--color-gold)]/50 focus:shadow-[0_0_20px_oklch(0.72 0.16 85)] placeholder:text-white/20"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              placeholder="Cuéntanos en qué podemos ayudarte..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl px-8 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.72 0.16 85)] hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "linear-gradient(135deg, var(--color-gold) 0%, #B8941F 100%)",
              color: "var(--color-bg)",
            }}
          >
            Enviar Mensaje
          </button>
        </form>
      )}
    </section>
  )
}

export default ContactForm
