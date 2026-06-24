"use client"

import { forwardRef } from "react"

interface FAQHeroProps {
  heroLineRef?: React.Ref<HTMLDivElement>
}

const FAQHero = forwardRef<HTMLDivElement, FAQHeroProps>(function FAQHero(
  { heroLineRef },
  ref
) {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <h1
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
        style={{
          fontFamily: "var(--font-instrument-serif)",
          background:
            "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Preguntas Frecuentes
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[#8A8A8A] opacity-0"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
      >
        Todo lo que necesitas saber sobre nuestras piezas
      </p>
      <div
        ref={heroLineRef}
        className="mt-12 w-20 h-[1px] bg-[#D4AF37] origin-center"
      />
    </section>
  )
})

export default FAQHero
