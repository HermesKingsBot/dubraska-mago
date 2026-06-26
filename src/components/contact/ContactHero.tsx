"use client"

interface ContactHeroProps {
  ref?: React.Ref<HTMLDivElement>
}

function ContactHero({ ref }: ContactHeroProps): React.JSX.Element {
  return (
    <section ref={ref} className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <h1
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
        style={{
          fontFamily: "var(--font-playfair)",
          background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Hablemos
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed text-[var(--color-muted)] opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Piezas personalizadas, consultas sobre existencias o simplemente para saludarnos.
        Estamos aquí para ti.
      </p>
    </section>
  )
}

export default ContactHero
