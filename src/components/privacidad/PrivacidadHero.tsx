"use client"

interface PrivacidadHeroProps {
  heroLineRef?: React.Ref<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function PrivacidadHero({ heroLineRef, ref }: PrivacidadHeroProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] opacity-0"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Política de{" "}
        <span
          style={{
            background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.92 0.12 85) 50%, var(--color-gold) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Privacidad
        </span>
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed text-[var(--color-muted)] opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Tu información personal es importante para nosotros
      </p>
      <div
        ref={heroLineRef}
        className="mt-8 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />
      <div
        data-badge
        className="mt-6 inline-block rounded-full border border-[rgba(212,175,55,0.2)] bg-[oklch(0.05_0_0)] px-4 py-1.5 text-xs text-[var(--color-muted)] tracking-wide opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
      >
        Última actualización: Junio 2026
      </div>
    </section>
  )
}

export default PrivacidadHero
