"use client"

import { motion } from "motion/react"

interface TransportadorasCardsProps {
  ref?: React.Ref<HTMLDivElement>
}

const TRANSPORTADORAS = [
  {
    name: "MRW",
    description: "Cobertura nacional amplia, ideal para zonas urbanas. Servicio confiable con entrega en 24 a 72 horas dependiendo de la ciudad.",
    tags: ["Cobro Destino", "Nacional", "Urbano"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    name: "Zoom",
    description: "Entrega rápida con seguimiento en línea. Excelente opción para envíos urgentes dentro de las principales ciudades.",
    tags: ["Cobro Destino", "Rápida", "Tracking"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "TEALCA",
    description: "Cobertura en zonas rurales e interior del país. Ideal si necesitas enviar a estados fuera de las grandes ciudades.",
    tags: ["Cobro Destino", "Interior", "Rural"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    name: "Domesa",
    description: "Opción económica para paquetes de mayor tamaño. Ideal para envíos de sets completos o piezas voluminosas.",
    tags: ["Cobro Destino", "Económica", "Grande"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
]

function TransportadorasCards({ ref }: TransportadorasCardsProps): React.JSX.Element {
  return (
    <section ref={ref} className="px-6 py-20 md:py-28 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Nuestras{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Transportadoras
          </span>
        </h2>
        <p
          className="text-[var(--color-muted)] mt-4 text-sm sm:text-base max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
        >
          Trabajamos con las principales empresas de transporte para garantizar que tu pieza llegue en perfecto estado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TRANSPORTADORAS.map((t) => (
          <motion.div
            key={t.name}
            data-card
            whileHover={{ y: -6, boxShadow: "0 0 30px rgba(212,175,55,0.12)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--color-dark-card)] p-6 sm:p-8 transition-all duration-300 hover:border-[var(--color-gold)]/30 opacity-0"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--color-dark-accent)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center group-hover:border-[var(--color-gold)]/20 transition-colors duration-300">
                {t.icon}
              </div>
              <div>
                <h3
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2.5 py-0.5 text-[11px] rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)] bg-[var(--color-gold)]/5"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
            >
              {t.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default TransportadorasCards
