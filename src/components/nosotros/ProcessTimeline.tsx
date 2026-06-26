"use client"

interface ProcessTimelineProps {
  ref?: React.Ref<HTMLDivElement>
}

const PROCESS_STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Diseño",
    desc: "Cada pieza nace de un boceto a mano. Pensamos en la forma, la proporción y cómo se sentirá en tu piel antes de dar el primer paso.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Selección",
    desc: "Elegimos acero inoxidable de grado premium y lo bañamos en oro 18K. Cada material cumple con nuestros estándares de calidad y durabilidad.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Creación",
    desc: "Artesanos con años de experiencia ensamblan cada pieza a mano, con atención al detalle que la fabricación masiva no puede igualar.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
    title: "Entrega",
    desc: "Empacamos cada pieza con cuidado premium para que llegue perfecta a tus manos. Un detalle que se siente desde que abres la caja.",
  },
]

function ProcessTimeline({ ref }: ProcessTimelineProps): React.JSX.Element {
  return (
    <section className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, rgba(5,5,5,0) 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
          >
            Artesanía
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Nuestro <em className="text-[var(--color-gold)]">Proceso</em>
          </h2>
          <div className="mt-6 mx-auto w-16 h-[1px] bg-[var(--color-gold)]/40" />
        </div>

        <div ref={ref} className="relative">
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-[1px] bg-[rgba(212,175,55,0.15)]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.title}
                data-process-step
                className="relative flex flex-col items-center text-center opacity-0"
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
                  {step.icon}
                </div>
                <p
                  className="text-xs text-[var(--color-gold)]/50 mb-2 uppercase tracking-[2px]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
                >
                  Paso {i + 1}
                </p>
                <h3
                  className="text-lg sm:text-xl text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline
