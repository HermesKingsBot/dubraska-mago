"use client"

interface HeroEnviosProps {
  heroLineRef?: React.Ref<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function HeroEnvios({ heroLineRef, ref }: HeroEnviosProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-44 md:pb-32"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03]"
        width="400"
        height="400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="0.5"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>

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
        Envíos
      </h1>
      <p
        className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[var(--color-muted)] opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Enviamos tus piezas de joyería con la seguridad y dedicación que merecen.
        Envíos nacionales con cobro destino a toda Venezuela.
      </p>
      <div
        ref={heroLineRef}
        className="mt-12 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />
    </section>
  )
}

export default HeroEnvios
