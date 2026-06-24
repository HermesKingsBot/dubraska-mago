"use client"

import { forwardRef } from "react"

const ExchangePolicy = forwardRef<HTMLDivElement>(function ExchangePolicy(props, ref) {
  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
      style={{ background: "#0A0A0A" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#050505]/80 p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Política de Cambios
            </h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3
                className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Cambio por defecto de fabricación
              </h3>
              <ul className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Si tu pieza llega con un defecto de fabricación (no por uso), <span className="text-white font-medium">te la cambiamos sin costo</span>.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Debes reportarlo dentro de las primeras <span className="text-white font-medium">48 horas</span> después de recibir el producto.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Envía fotos o video del defecto a nuestro WhatsApp.
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Cambio por talla o modelo
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-4"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Si necesitas una talla diferente o quieres cambiar por otro modelo:
              </p>
              <ul className="space-y-3">
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Tienes <span className="text-white font-medium">7 días</span> para solicitarlo.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  La pieza debe estar en condiciones originales.
                </li>
                <li
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  El cliente cubre el envío de retorno; <span className="text-white font-medium">nosotros cubrimos el envío de la nueva pieza</span>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ExchangePolicy
