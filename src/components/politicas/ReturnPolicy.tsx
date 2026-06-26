"use client"

interface ReturnPolicyProps {
  ref?: React.Ref<HTMLDivElement>
}

function ReturnPolicy({ ref }: ReturnPolicyProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14l-4-4 4-4" />
                <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Política de Devoluciones
            </h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Plazo de Devolución
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                Tienes <span className="text-[var(--color-white)] font-medium">7 días calendario</span> desde la recepción del producto para solicitar un cambio o devolución.
              </p>
            </div>

            <div>
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Condiciones
              </h3>
              <ul className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-gold)]/50"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  La pieza debe estar sin usar, sin marcas de uso, en su empaque original y con todas las etiquetas intactas.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-gold)]/50"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  El producto debe venir con el mismo empaque de entrega (bolsa de terciopelo, caja, etc.).
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                ¿Cómo solicitar una devolución?
              </h3>
              <ol className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['1'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[var(--color-bg)] before:flex before:items-center before:justify-center before:text-[10px] before:text-[var(--color-gold)] before:font-medium"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  Envía un mensaje a nuestro WhatsApp con tu número de pedido y el motivo.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['2'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[var(--color-bg)] before:flex before:items-center before:justify-center before:text-[10px] before:text-[var(--color-gold)] before:font-medium"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  Te enviaremos la dirección de envío y las instrucciones.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['3'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[var(--color-bg)] before:flex before:items-center before:justify-center before:text-[10px] before:text-[var(--color-gold)] before:font-medium"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  Una vez recibida la pieza y verificado su estado, procesamos el reembolso en 3-5 días hábiles.
                </li>
              </ol>
            </div>

            <div>
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Costos de envío de devolución
              </h3>
              <ul className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-gold)]/50"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  Si la devolución es por defecto nuestro: <span className="text-[var(--color-white)] font-medium">nosotros cubrimos el envío</span>.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--color-gold)]/50"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  Si es por cambio de opinión: <span className="text-[var(--color-white)] font-medium">el cliente cubre el costo de envío de retorno</span>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReturnPolicy
