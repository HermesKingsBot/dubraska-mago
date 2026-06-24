"use client"

interface ValuesGridProps {
  ref?: React.Ref<HTMLDivElement>
}

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: "Materiales Premium",
    desc: "Acero inoxidable bañado en oro 18K",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Diseño Atemporal",
    desc: "Piezas que nunca pasan de moda",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Hecho con Amor",
    desc: "Artesanalmente elaboradas con dedicación",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
    title: "Envío Seguro",
    desc: "Empaque protegido y cuidadoso",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Garantía",
    desc: "Satisfacción garantizada o te devolvemos tu dinero",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Atención Personalizada",
    desc: "Piezas personalizadas bajo pedido",
  },
]

function ValuesGrid({ ref }: ValuesGridProps): React.JSX.Element {
  return (
    <section className="relative w-full py-24 sm:py-32 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Diferencia
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Lo que nos hace <em className="text-[var(--color-gold)]">únicos</em>
          </h2>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {VALUES.map((item) => (
            <div
              key={item.title}
              data-value-item
              className="group relative p-6 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[var(--color-bg)]/50 hover:border-[rgba(212,175,55,0.12)] hover:-translate-y-1 transition-all duration-500 opacity-0"
            >
              <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {item.icon}
              </div>
              <h3
                className="text-base sm:text-lg text-white font-medium mb-2"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm text-[var(--color-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                {item.desc}
              </p>
              <div className="absolute inset-0 rounded-xl bg-[var(--color-gold)]/0 group-hover:bg-[var(--color-gold)]/[0.02] transition-colors duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuesGrid
