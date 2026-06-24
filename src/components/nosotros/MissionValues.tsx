"use client"

interface MissionValuesProps {
  ref?: React.Ref<HTMLDivElement>
}

const MISSION_CARDS = [
  {
    title: "Misión",
    desc: "Crear joyería de acero inoxidable bañado en oro 18K que haga a cada mujer sentirse segura, única y poderosa. Piezas accesibles, duraderas y diseñadas para el día a día.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Visión",
    desc: "Ser la marca de joyería preferida en Venezuela y Latinoamérica, reconocida por nuestra calidad, diseño atemporal y la conexión personal que creamos con cada clienta.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Filosofía",
    desc: "Menos es más. Diseñamos piezas mínimas, atemporales y versátiles. Joyería que se adapta a tu vida, no al revés. Calidad sobre cantidad, siempre.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

function MissionValues({ ref }: MissionValuesProps): React.JSX.Element {
  return (
    <section className="relative w-full py-24 sm:py-32 md:py-40" style={{ background: "#0A0A0A" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Nuestro propósito
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Lo que nos <em className="text-[var(--color-gold)]">mueve</em>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MISSION_CARDS.map((card) => (
            <div
              key={card.title}
              data-mission-card
              className="relative p-8 rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)]/80 opacity-0"
            >
              <div className="mb-5 opacity-70">{card.icon}</div>
              <h3
                className="text-xl sm:text-2xl text-white mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                {card.desc}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-[var(--color-gold)]/0 hover:bg-[var(--color-gold)]/[0.02] transition-colors duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MissionValues
