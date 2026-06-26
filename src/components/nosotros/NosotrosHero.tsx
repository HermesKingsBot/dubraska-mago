"use client"

interface NosotrosHeroProps {
  heroLineRef?: React.Ref<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function NosotrosHero({ heroLineRef, ref }: NosotrosHeroProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-44 md:pb-32"
    >
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
        Nuestra Historia
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[var(--color-muted)] opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Donde la artesanía venezolana se encuentra con el lujo atemporal.
        Cada pieza es una celebración de lo que significa ser única.
      </p>
      <div
        ref={heroLineRef}
        className="mt-12 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />
    </section>
  )
}

export default NosotrosHero
