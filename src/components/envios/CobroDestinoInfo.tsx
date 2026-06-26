"use client"

interface CobroDestinoInfoProps {
  ref?: React.Ref<HTMLDivElement>
}

const COSTOS = [
  { zona: "Caracas y gran Caracas", costo: "$3 - $5", tiempo: "24 - 48h" },
  { zona: "Ciudades principales", costo: "$4 - $7", tiempo: "48 - 72h" },
  { zona: "Estados cercanos", costo: "$5 - $8", tiempo: "72h - 5 días" },
  { zona: "Interior del país", costo: "$6 - $10", tiempo: "5 - 8 días" },
]

function CobroDestinoInfo({ ref }: CobroDestinoInfoProps): React.JSX.Element {
  return (
    <section ref={ref} className="px-6 py-20 md:py-28 max-w-5xl mx-auto opacity-0">
      <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--color-dark-card)] p-8 sm:p-10 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span
              className="text-xs font-medium text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Información importante
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¿Qué es{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cobro Destino
            </span>
            ?
          </h2>
        </div>

        <div className="max-w-2xl mx-auto text-center mb-10">
          <p
            className="text-base sm:text-lg leading-relaxed text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            El costo del envío se paga al retirar el paquete en la oficina de la transportadora.
            No necesitas pagar el envío por adelantado, solo retiras y pagas allá.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              ),
              title: "No pagas por adelantado",
              desc: "El envío se paga únicamente al momento de retirar tu pedido en la oficina.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              ),
              title: "Solo necesitas tu cédula",
              desc: "Presenta tu cédula de identidad y el código de guía que te enviamos por WhatsApp.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
              title: "Retiras cuando puedas",
              desc: "Tu paquete espera en la oficina. Retíralo cuando te convenga, generalmente hasta 5 días hábiles.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-5 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[var(--color-bg)]"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <h4
                className="text-sm font-semibold text-white mb-1.5"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {item.title}
              </h4>
              <p
                className="text-xs text-[var(--color-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
          <div className="px-6 py-3 bg-[var(--color-gold)]/5 border-b border-[rgba(255,255,255,0.06)]">
            <h4
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Costos estimados por zona (informativo)
            </h4>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {COSTOS.map((c) => (
              <div
                key={c.zona}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 px-6 py-3.5"
              >
                <span
                  className="text-sm text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  {c.zona}
                </span>
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {c.costo}
                  </span>
                  <span
                    className="text-xs text-[var(--color-muted)]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {c.tiempo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center text-[11px] text-[oklch(0.45_0_0)] mt-4"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Los costos son aproximados y pueden variar según la transportadora y la zona exacta de entrega.
        </p>
      </div>
    </section>
  )
}

export default CobroDestinoInfo
