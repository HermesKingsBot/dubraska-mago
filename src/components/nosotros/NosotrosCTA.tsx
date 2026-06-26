"use client"

import { useState, useEffect } from "react"

interface NosotrosCTAProps {
  ref?: React.Ref<HTMLDivElement>
}

function NosotrosCTA({ ref }: NosotrosCTAProps): React.JSX.Element {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([])

  useEffect(() => {
    const p = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }))
    setParticles(p)
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 md:py-32 opacity-0">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0) 70%)",
        }}
      />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[var(--color-gold)]/30 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float-${p.id % 5} ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -25px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, -15px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -35px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
      `}</style>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ¿Quieres ser parte de nuestra{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            historia
          </span>
          ?
        </h2>
        <p
          className="text-base sm:text-lg text-[var(--color-muted)] mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
        >
          Únete a nuestra comunidad y sé la primera en conocer nuevas colecciones,
          piezas exclusivas y ofertas especiales.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/colecciones"
            className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "linear-gradient(135deg, var(--color-gold) 0%, #B8941F 100%)",
              color: "var(--color-bg)",
            }}
          >
            Ver Colección
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Contactar
          </a>
          <a
            href="https://instagram.com/dubraska.mago"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

export default NosotrosCTA
