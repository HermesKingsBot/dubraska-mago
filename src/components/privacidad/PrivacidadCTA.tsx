"use client"

import { useState, useEffect } from "react"

interface PrivacidadCTAProps {
  ref?: React.Ref<HTMLDivElement>
}

function PrivacidadCTA({ ref }: PrivacidadCTAProps): React.JSX.Element {
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
        @keyframes float-0 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, -30px); } }
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-15px, -25px); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(25px, -15px); } }
        @keyframes float-3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, -35px); } }
        @keyframes float-4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10px, -20px); } }
      `}</style>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ¿Tienes{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.92 0.12 85) 50%, var(--color-gold) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            preguntas
          </span>{" "}
          sobre tu privacidad?
        </h2>
        <p
          className="text-base sm:text-lg text-[var(--color-muted)] mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
        >
          Estamos aquí para resolver cualquier duda sobre cómo manejamos tu información personal
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/584141234567?text=Hola,%20tengo%20una%20pregunta%20sobre%20la%20pol%C3%ADtica%20de%20privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "linear-gradient(135deg, var(--color-gold) 0%, oklch(0.68 0.12 75) 100%)",
              color: "var(--color-bg)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="mailto:info@dubraskamago.com"
            className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Enviar email
          </a>
        </div>
        <div className="mt-10">
          <a
            href="/"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </section>
  )
}

export default PrivacidadCTA
