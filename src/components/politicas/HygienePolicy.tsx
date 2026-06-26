"use client"

interface HygienePolicyProps {
  ref?: React.Ref<HTMLDivElement>
}

function HygienePolicy({ ref }: HygienePolicyProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(232,180,184,0.25)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14 relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(232,180,184,0.04) 0%, rgba(5,5,5,0) 70%)",
            }}
          />

          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,180,184,0.3)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Higiene — Aclaración Importante
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3
                className="text-lg sm:text-xl text-[var(--color-rose)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Sobre cambios por higiene (Aretes, Zarcillos y Piercings)
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                Por motivos de <span className="text-[var(--color-white)] font-medium">higiene y salud</span>, <span className="text-[var(--color-rose)] font-medium">no aceptamos devoluciones ni cambios de aretes, zarcillos, piercings o cualquier pieza que se introduzca en la oreja o cuerpo</span>.
              </p>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mt-3"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                Una vez abiertos o usados, estos artículos no pueden ser revendidos ni reutilizados por razones sanitarias.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[var(--color-bg)]/80 p-6">
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                <span className="text-[var(--color-gold)] font-medium">Excepción:</span> Si la pieza llega defectuosa de fábrica (cierre roto, pieza torcida, etc.), sí procede el cambio sin costo. Debe reportarse en las primeras 48 horas con fotos.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[var(--color-bg)] p-6">
              <h4
                className="text-base sm:text-lg text-[var(--color-gold)] mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Recomendación
              </h4>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                Revisa bien la pieza al recibirla. Si tienes alguna duda sobre el modelo o tamaño, contáctanos antes de usarla.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HygienePolicy
