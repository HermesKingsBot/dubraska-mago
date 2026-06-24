"use client"

import { forwardRef } from "react"

const ShippingDamage = forwardRef<HTMLDivElement>(function ShippingDamage(props, ref) {
  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
      style={{ background: "#0A0A0A" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#050505]/80 p-8 sm:p-10 md:p-14 relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, rgba(5,5,5,0) 70%)",
            }}
          />

          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              ¿Qué pasa si mi pieza llega rota por el envío?
            </h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3
                className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Daños durante el envío
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-4"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Si tu paquete llega visiblemente dañado en el exterior (caja aplastada, rota, mojada):
              </p>
              <ol className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['1'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-white font-medium">No lo recibas</span> o documenta el daño con fotos/video en el momento de la entrega.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['2'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-white font-medium">Contáctanos inmediatamente</span> por WhatsApp con fotos del empaque y la pieza.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['3'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-white font-medium">Nos haremos cargo al 100%</span> — te enviaremos una pieza nueva sin costo o te reembolsaremos completamente.
                </li>
              </ol>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#0A0A0A] p-6">
              <h4
                className="text-base sm:text-lg text-[#D4AF37] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Proceso para piezas dañadas
              </h4>
              <ul className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Envía evidencia fotográfica dentro de las primeras <span className="text-white font-medium">24 horas</span>.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Verificamos el caso (puede tomar 1-2 días hábiles).
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Te enviamos un reemplazo o procesamos el reembolso completo.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-white font-medium">No necesitas devolver la pieza dañada</span> — quédate como evidencia.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#050505]/60 p-6">
              <h4
                className="text-base sm:text-lg text-[#D4AF37] mb-3"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Nuestra promesa
              </h4>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Cada pieza sale de nuestro taller con empaque protector diseñado para el transporte. Si llega dañada, es responsabilidad del transportista y nosotros respondemos por ti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ShippingDamage
