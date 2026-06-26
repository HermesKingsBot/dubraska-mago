"use client"

interface TercerosProps {
  ref?: React.Ref<HTMLDivElement>
}

function Terceros({ ref }: TercerosProps): React.JSX.Element {
  const entidades = [
    { nombre: "Meta / WhatsApp Business API", uso: "Comunicación directa con clientes por WhatsApp" },
    { nombre: "MRW / Zoom / TEALCA / Domesa", uso: "Transporte y entrega de pedidos en toda Venezuela" },
    { nombre: "Google Analytics", uso: "Análisis de tráfico y comportamiento de navegación" },
    { nombre: "Vercel", uso: "Hosting y despliegue de la aplicación web" },
    { nombre: "Neon (PostgreSQL)", uso: "Base de datos principal con cifrado en reposo" },
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Terceros y enlaces externos
            </h2>
          </div>

          <p
            className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-8"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Trabajamos con servicios confiables para operar nuestra tienda. Estos terceros acceden a datos solo cuando es estrictamente necesario:
          </p>

          <ul className="space-y-3 mb-8">
            {entidades.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  <span className="text-[var(--color-white)] font-medium">{e.nombre}</span> — {e.uso}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[oklch(0.08_0.01_85)] p-6">
            <p
              className="text-sm text-[#B0B0B0] leading-[1.9]"
              style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
            >
              <span className="text-[var(--color-gold)] font-medium">No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines de marketing.</span>{" "}
              La información se comparte únicamente para las finalidades descritas en esta política.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Terceros
