"use client"

interface EnvioDetalleProps {
  ref?: React.Ref<HTMLDivElement>
}

const STEPS = [
  {
    number: "01",
    title: "Confirmas tu pedido",
    description: "Realizas tu compra por WhatsApp y confirmamos los detalles de tu pieza.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Empaquetamos con protección premium",
    description: "Tu pieza viaja en caja regalo con burbuja protectora y etiqueta de frágil.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Despachamos tu envío",
    description: "Coordinamos con la transportadora que elijas para despachar el mismo día.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Recibes tu guía de seguimiento",
    description: "Te enviamos el número de guía por WhatsApp para que rastrees tu envío en tiempo real.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Retiras y pagas en la oficina",
    description: "Presenta tu cédula en la oficina de cobro destino de la transportadora y retira tu pieza.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

function EnvioDetalle({ ref }: EnvioDetalleProps): React.JSX.Element {
  return (
    <section ref={ref} className="px-6 py-20 md:py-28 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Así funciona tu{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            envío
          </span>
        </h2>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-gold)]/20 via-[var(--color-gold)]/40 to-[var(--color-gold)]/20" />

        <div className="space-y-8 md:space-y-0">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              data-step
              className="relative flex gap-6 md:gap-8 opacity-0"
            >
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-dark-card)] flex items-center justify-center">
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-[56px] left-1/2 -translate-x-1/2 w-px h-8 bg-[var(--color-gold)]/20" />
                )}
              </div>

              <div className="flex-1 pb-8 md:pb-12">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs font-semibold tracking-wider text-[var(--color-gold)]/60"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    PASO {step.number}
                  </span>
                </div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-white mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-[var(--color-muted)] max-w-md"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EnvioDetalle
