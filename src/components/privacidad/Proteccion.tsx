"use client"

interface ProteccionProps {
  ref?: React.Ref<HTMLDivElement>
}

function Proteccion({ ref }: ProteccionProps): React.JSX.Element {
  const medidas = [
    "Encriptación SSL/TLS en todas las transacciones de datos",
    "Autenticación JWT con tokens httpOnly (inaccesibles desde JavaScript)",
    "Acceso restringido a datos personales solo para personal autorizado",
    "Base de datos PostgreSQL (Neon) con cifrado en reposo",
    "Backups automáticos y monitoreo de seguridad continuo",
    "Panel de administración con roles y permisos granulares por empleado",
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Protección de datos
            </h2>
          </div>

          <ul className="space-y-4 mb-8">
            {medidas.map((medida, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  {medida}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[oklch(0.08_0.01_85)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3
                className="text-base font-medium text-[var(--color-gold)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Importante
              </h3>
            </div>
            <p
              className="text-sm text-[#B0B0B0] leading-[1.9]"
              style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
            >
              <span className="text-[var(--color-white)] font-medium">Nunca almacenamos datos de tarjetas de crédito o débito.</span>{" "}
              Todos los pagos se procesan de forma manual a través de WhatsApp, garantizando que tu información financiera nunca pase por nuestros servidores.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Proteccion
