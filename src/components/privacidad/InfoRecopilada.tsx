"use client"

interface InfoRecopiladaProps {
  ref?: React.Ref<HTMLDivElement>
}

function InfoRecopilada({ ref }: InfoRecopiladaProps): React.JSX.Element {
  const datos = [
    { dato: "Nombre completo", ejemplo: "María García", porQue: "Identificación y comunicación personalizada" },
    { dato: "Teléfono", ejemplo: "+58 414 123 4567", porQue: "Coordinar entregas y seguimiento por WhatsApp" },
    { dato: "Cédula o RIF", ejemplo: "V-12.345.678", porQue: "Facturación y cumplimiento fiscal" },
    { dato: "Dirección de envío", ejemplo: "Caracas, Venezuela", porQue: "Despacho de pedidos a tu ubicación" },
    { dato: "Correo electrónico", ejemplo: "maria@email.com", porQue: "Confirmaciones, facturas y notificaciones" },
    { dato: "Historial de pedidos", ejemplo: "Collar Audaz, 2024", porQue: "Soporte post-venta y garantías" },
    { dato: "Dirección IP", ejemplo: "190.24.x.x", porQue: "Seguridad y prevención de fraude" },
    { dato: "Cookies y preferencias", ejemplo: "Idioma, carrito", porQue: "Mejorar tu experiencia de navegación" },
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Información que recopilamos
            </h2>
          </div>

          <p
            className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-8"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Recopilamos únicamente la información necesaria para brindarte un excelente servicio de compra de joyería de lujo.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-[var(--color-bg)] rounded-tl-lg"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.68 0.12 75) 100%)",
                    }}
                  >
                    Dato
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-[var(--color-bg)]"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.68 0.12 75) 100%)",
                    }}
                  >
                    Ejemplo
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-[var(--color-bg)] rounded-tr-lg"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.68 0.12 75) 100%)",
                    }}
                  >
                    ¿Por qué?
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, i) => (
                  <tr
                    key={i}
                    className="border-b border-[rgba(212,175,55,0.08)] last:border-b-0"
                  >
                    <td
                      className="py-3 px-4 text-sm text-[var(--color-white)] font-medium"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {fila.dato}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {fila.ejemplo}
                    </td>
                    <td
                      className="py-3 px-4 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {fila.porQue}
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

export default InfoRecopilada
