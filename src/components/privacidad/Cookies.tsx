"use client"

interface CookiesProps {
  ref?: React.Ref<HTMLDivElement>
}

function Cookies({ ref }: CookiesProps): React.JSX.Element {
  const cookies = [
    {
      nombre: "auth_token",
      tipo: "Sesión",
      duracion: "Sesión (se cierra al cerrar el navegador)",
      finalidad: "Autenticación JWT para mantener tu sesión activa",
    },
    {
      nombre: "cart_data",
      tipo: "Preferencias",
      duracion: "30 días",
      finalidad: "Recordar los productos en tu carrito de compras",
    },
    {
      nombre: "_ga / _gid",
      tipo: "Analítica",
      duracion: "2 años / 24 horas",
      finalidad: "Google Analytics — analizar tráfico y comportamiento de navegación",
    },
    {
      nombre: "locale",
      tipo: "Preferencias",
      duracion: "1 año",
      finalidad: "Recordar tu idioma y configuración regional",
    },
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Cookies y tecnologías
            </h2>
          </div>

          <p
            className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-8"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Utilizamos cookies para mejorar tu experiencia. Puedes gestionar tus preferencias desde la configuración de tu navegador.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  {["Cookie", "Tipo", "Duración", "Finalidad"].map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-3 px-4 text-sm font-medium text-[var(--color-bg)] ${
                        i === 0 ? "rounded-tl-lg" : ""
                      } ${i === 3 ? "rounded-tr-lg" : ""}`}
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.68 0.12 75) 100%)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cookies.map((c, i) => (
                  <tr key={i} className="border-b border-[rgba(212,175,55,0.08)] last:border-b-0">
                    <td
                      className="py-3 px-4 text-sm text-[var(--color-gold)] font-medium"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {c.nombre}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {c.tipo}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {c.duracion}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {c.finalidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cookies
