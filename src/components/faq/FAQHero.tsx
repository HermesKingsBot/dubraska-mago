"use client"

interface FAQHeroProps {
  heroLineRef?: React.Ref<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function FAQHero({ heroLineRef, ref }: FAQHeroProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <h1
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
        style={{
          fontFamily: "var(--font-playfair)",
          background:
            "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.92 0.08 85) 50%, var(--color-gold) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Preguntas Frecuentes
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[var(--color-muted)] opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Todo lo que necesitas saber sobre nuestras piezas
      </p>
      <div
        ref={heroLineRef}
        className="mt-12 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />
    </section>
  )
}

export default FAQHero
