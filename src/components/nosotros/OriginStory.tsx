"use client"

import { forwardRef } from "react"

const OriginStory = forwardRef<HTMLDivElement>(function OriginStory(props, ref) {
  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div ref={ref} className="lg:col-span-7 flex flex-col justify-center opacity-0">
            <p
              className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-6"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              El origen
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.15] tracking-[-1px] mb-8"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Todo empezó con una{" "}
              <em className="text-[#D4AF37]">visión</em>
            </h2>

            <div className="space-y-6">
              <p
                className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Dubraska Mago nació en Venezuela, un país donde la creatividad y la
                resiliencia son parte de la identidad. Desde joven, Dubraska descubrió
                su pasión por el diseño y la artesanía, admirando cómo una pieza
                bien hecha puede transformar la forma en que una persona se siente.
              </p>

              <p
                className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                La marca nació con un propósito claro: crear joyería de{" "}
                <span className="text-white font-medium">calidad premium</span> que
                fuera accesible para todas. Piezas que no se desucken, que no
                irritan la piel, y que mantienen su brillo con el paso del tiempo.
              </p>

              <p
                className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Hoy, Dubraska Mago es más que una marca de joyería. Es una{" "}
                <span className="text-[#D4AF37] font-medium">extensión de tu
                personalidad</span>, una forma de expresar quién eres sin
                necesidad de palabras.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#D4AF37]/40" />
              <p
                className="text-[#D4AF37] text-lg italic"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Con cariño, Dubraska ✦
              </p>
            </div>
          </div>

          <OriginStoryImage />
        </div>
      </div>
    </section>
  )
})

function OriginStoryImage() {
  return (
    <div className="lg:col-span-5 relative">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-[#D4AF37]/20 flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <p
            className="text-[#D4AF37]/30 text-sm tracking-[3px] uppercase"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Imagen de la marca
          </p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[rgba(212,175,55,0.06)] rounded-2xl -z-10" />
      <div className="absolute -top-4 -left-4 w-24 h-24 border border-[rgba(212,175,55,0.04)] rounded-2xl -z-10" />
    </div>
  )
}

export default OriginStory
