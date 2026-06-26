"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Acero Inoxidable + Oro 18K",
    desc: "No se despinta, no se pone verde, no irrita tu piel. Cada pieza lleva un baño de oro 18K que mantiene su brillo con el tiempo. Calidad que ves y sientes.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Pieles sensibles, tranquilas",
    desc: "Todas nuestras piezas son hipoalergénicas. Puedes usarlas todo el día sin irritaciones. Porque sentirte bonita no debería costarte una alergia.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    title: "Resistente al agua y sudor",
    desc: "Lluvia, gym, playa... tu pieza se queda perfecta. Recomendamos secarlas suavemente después del contacto con agua para mantener el brillo por más tiempo.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Garantía de satisfacción",
    desc: "Estoy tan segura de que vas a amar tu pieza que si en 3 días no te convence, la cambiamos o te devolvemos el dinero. Sin preguntas incómodas.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
        <path d="M18 17V9a2 2 0 0 0-2-2h-2" />
      </svg>
    ),
    title: "Envío a toda Venezuela",
    desc: "Caracas, Maracaibo, Barquisimeto, Margarita... donde estés, te lo envío. Coordinamos por WhatsApp la forma más cómoda para ti.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M12 11v2" />
      </svg>
    ),
    title: "Atención personalizada",
    desc: "Cuando me escribes, me escribes directamente a mí, Dubraska. Te ayudo a elegir, te doy tips de cuidado y me aseguro de que tu experiencia sea increíble.",
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const items = gridRef.current?.querySelectorAll(".feature-item")
        if (items?.length) {
          gsap.fromTo(
            items,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(max-width: 767px)", () => {
        const items = gridRef.current?.querySelectorAll(".feature-item")
        if (items?.length) {
          gsap.fromTo(
            items,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const _fi = gridRef.current?.querySelectorAll(".feature-item")
        if (_fi) gsap.set(_fi, { opacity: 1, y: 0 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative w-full py-28 sm:py-36 md:py-44" style={{ background: "oklch(0.05 0 0)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
          >
            Calidad que se nota
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hechas para durar,{" "}
            <em className="text-[var(--color-gold)]">diseñadas para ti</em>
          </h2>
          <p
            className="text-base sm:text-lg text-[var(--color-muted)] mt-5 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Materiales premium que cuidan tu piel y tu bolsillo.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="feature-item group relative p-6 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[var(--color-bg)]/50 hover:border-[rgba(212,175,55,0.12)] transition-all duration-500"
            >
              <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {feature.icon}
              </div>

              <h3
                className="text-base sm:text-lg text-white font-medium mb-3"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600 }}
              >
                {feature.title}
              </h3>

              <p
                className="text-sm text-[var(--color-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                {feature.desc}
              </p>

              <div className="absolute inset-0 rounded-xl bg-[var(--color-gold)]/0 group-hover:bg-[var(--color-gold)]/[0.02] transition-colors duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
