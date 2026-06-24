"use client"

import { forwardRef } from "react"

interface PoliticasHeroProps {
  heroLineRef?: React.Ref<HTMLDivElement>
}

const PoliticasHero = forwardRef<HTMLDivElement, PoliticasHeroProps>(function PoliticasHero(
  { heroLineRef },
  ref
) {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] opacity-0"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Políticas de{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Cambios y Devoluciones
        </span>
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed text-[#8A8A8A] opacity-0"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
      >
        Tu satisfacción y confianza son nuestra prioridad
      </p>
      <div
        ref={heroLineRef}
        className="mt-8 w-20 h-[1px] bg-[#D4AF37] origin-center"
      />
      <div
        data-badge
        className="mt-6 inline-block rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A] px-4 py-1.5 text-xs text-[#8A8A8A] tracking-wide opacity-0"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
      >
        Última actualización: Junio 2026
      </div>
    </section>
  )
})

export default PoliticasHero
