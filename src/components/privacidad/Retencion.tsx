"use client"

interface RetencionProps {
  ref?: React.Ref<HTMLDivElement>
}

function Retencion({ ref }: RetencionProps): React.JSX.Element {
  const periodos = [
    { dato: "Datos de cuenta", periodo: "Hasta que solicites eliminación", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { dato: "Historial de pedidos", periodo: "5 años desde la última compra", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { dato: "Datos fiscales", periodo: "6 a 10 años (obligación legal)", icon: "M9 14l6-6M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707 4.707C10.923 15.14 11.276 15 11.586 15H14a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h.586" },
    { dato: "Datos de navegación", periodo: "2 años desde la visita", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Retención de datos
            </h2>
          </div>

          <p
            className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-10"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Conservamos tu información solo durante el tiempo necesario para cumplir con las finalidades descritas:
          </p>

          <div className="relative pl-8 border-l border-[rgba(212,175,55,0.2)]">
            {periodos.map((p, i) => (
              <div key={i} className="relative mb-10 last:mb-0">
                <div className="absolute -left-[calc(2rem+6px)] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={p.icon} />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-base font-medium text-[var(--color-white)] mb-1"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {p.dato}
                  </h3>
                  <p
                    className="text-sm text-[var(--color-gold)]"
                    style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
                  >
                    {p.periodo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Retencion
