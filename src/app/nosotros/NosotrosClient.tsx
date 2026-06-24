"use client"

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const PROCESS_STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Diseño",
    desc: "Cada pieza nace de un boceto a mano. Pensamos en la forma, la proporción y cómo se sentirá en tu piel antes de dar el primer paso.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Selección",
    desc: "Elegimos acero inoxidable de grado premium y lo bañamos en oro 18K. Cada material cumple con nuestros estándares de calidad y durabilidad.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Creación",
    desc: "Artesanos con años de experiencia ensamblan cada pieza a mano, con atención al detalle que la fabricación masiva no puede igualar.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
    title: "Entrega",
    desc: "Empacamos cada pieza con cuidado premium para que llegue perfecta a tus manos. Un detalle que se siente desde que abres la caja.",
  },
]

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: "Materiales Premium",
    desc: "Acero inoxidable bañado en oro 18K",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Diseño Atemporal",
    desc: "Piezas que nunca pasan de moda",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Hecho con Amor",
    desc: "Artesanalmente elaboradas con dedicación",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
    title: "Envío Seguro",
    desc: "Empaque protegido y cuidadoso",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Garantía",
    desc: "Satisfacción garantizada o te devolvemos tu dinero",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Atención Personalizada",
    desc: "Piezas personalizadas bajo pedido",
  },
]

export default function NosotrosClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const originLeftRef = useRef<HTMLDivElement>(null)
  const originRightRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [counters, setCounters] = useState({ clientes: 0, piezas: 0, anos: 0 })
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroRef.current) {
          const heroH1 = heroRef.current.querySelector("h1")
          const heroP = heroRef.current.querySelector("p")

          if (heroH1) {
            gsap.fromTo(
              heroH1,
              { opacity: 0, y: 60, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }
            )
          }
          if (heroP) {
            gsap.fromTo(
              heroP,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" }
            )
          }
        }

        if (heroLineRef.current) {
          gsap.fromTo(
            heroLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              delay: 0.8,
              ease: "power2.inOut",
            }
          )
        }

        if (originLeftRef.current) {
          gsap.fromTo(
            originLeftRef.current,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: originLeftRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (originRightRef.current) {
          gsap.fromTo(
            originRightRef.current,
            { x: 80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: originRightRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (missionRef.current) {
          const cards = missionRef.current.querySelectorAll("[data-mission-card]")
          if (cards.length) {
            gsap.fromTo(
              cards,
              { y: 50, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: missionRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (processRef.current) {
          const steps = processRef.current.querySelectorAll("[data-process-step]")
          if (steps.length) {
            gsap.fromTo(
              steps,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: processRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
              const targets = { clientes: 500, piezas: 1000, anos: 3 }
              gsap.to(targets, {
                clientes: targets.clientes,
                piezas: targets.piezas,
                anos: targets.anos,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                  setCounters({
                    clientes: Math.round(targets.clientes),
                    piezas: Math.round(targets.piezas),
                    anos: Math.round(targets.anos),
                  })
                },
              })
            },
          })
        }

        if (valuesRef.current) {
          const items = valuesRef.current.querySelectorAll("[data-value-item]")
          if (items.length) {
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
                  trigger: valuesRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = [
          heroRef.current,
          heroLineRef.current,
          originLeftRef.current,
          originRightRef.current,
          missionRef.current,
          processRef.current,
          statsRef.current,
          valuesRef.current,
          ctaRef.current,
        ].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroLineRef.current) gsap.set(heroLineRef.current, { scaleX: 1 })
        setCounters({ clientes: 500, piezas: 1000, anos: 3 })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* ===== SECTION 1: HERO STORY ===== */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-44 md:pb-32"
      >
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Nuestra Historia
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[#8A8A8A] opacity-0"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Donde la artesanía venezolana se encuentra con el lujo atemporal.
          Cada pieza es una celebración de lo que significa ser única.
        </p>
        <div
          ref={heroLineRef}
          className="mt-12 w-20 h-[1px] bg-[#D4AF37] origin-center"
        />
      </section>

      {/* ===== SECTION 2: BRAND ORIGIN STORY ===== */}
      <section className="relative w-full overflow-hidden py-24 sm:py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* LEFT — Narrative */}
            <div ref={originLeftRef} className="lg:col-span-7 flex flex-col justify-center opacity-0">
              <p
                className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-6"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                El origen
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.15] tracking-[-1px] mb-8"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Todo empezó con una{" "}
                <em className="text-[#D4AF37]">visión</em>
              </h2>

              <div className="space-y-6">
                <p
                  className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Dubraska Mago nació en Venezuela, un país donde la creatividad y la
                  resiliencia son parte de la identidad. Desde joven, Dubraska descubrió
                  su pasión por el diseño y la artesanía, admirando cómo una pieza
                  bien hecha puede transformar la forma en que una persona se siente.
                </p>

                <p
                  className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  La marca nació con un propósito claro: crear joyería de{" "}
                  <span className="text-white font-medium">calidad premium</span> que
                  fuera accesible para todas. Piezas que no se desucken, que no
                  irritan la piel, y que mantienen su brillo con el paso del tiempo.
                </p>

                <p
                  className="text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Hoy, Dubraska Mago es más que una marca de joyería. Es una{" "}
                  <span className="text-[#D4AF37] font-medium">extensión de tu
                  personalidad</span>, una forma de expresar quién eres sin
                  necesidad de palabras.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]/40" />
                <p
                  className="text-[#D4AF37] text-lg italic"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Con cariño, Dubraska ✦
                </p>
              </div>
            </div>

            {/* RIGHT — Brand image placeholder */}
            <div ref={originRightRef} className="lg:col-span-5 relative opacity-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <p
                    className="text-[#D4AF37]/30 text-sm tracking-[3px] uppercase"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    Imagen de la marca
                  </p>
                </div>
              </div>
              {/* Decorative accent boxes */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[rgba(212,175,55,0.06)] rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[rgba(212,175,55,0.04)] rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: MISSION & VALUES ===== */}
      <section className="relative w-full py-24 sm:py-32 md:py-40" style={{ background: "#0A0A0A" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-5"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              Nuestro propósito
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Lo que nos <em className="text-[#D4AF37]">mueve</em>
            </h2>
          </div>

          <div ref={missionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Misión",
                desc: "Crear joyería de acero inoxidable bañado en oro 18K que haga a cada mujer sentirse segura, única y poderosa. Piezas accesibles, duraderas y diseñadas para el día a día.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ),
              },
              {
                title: "Visión",
                desc: "Ser la marca de joyería preferida en Venezuela y Latinoamérica, reconocida por nuestra calidad, diseño atemporal y la conexión personal que creamos con cada clienta.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                title: "Filosofía",
                desc: "Menos es más. Diseñamos piezas mínimas, atemporales y versátiles. Joyería que se adapta a tu vida, no al revés. Calidad sobre cantidad, siempre.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                data-mission-card
                className="relative p-8 rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#050505]/80 opacity-0"
              >
                <div className="mb-5 opacity-70">{card.icon}</div>
                <h3
                  className="text-xl sm:text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  {card.desc}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/0 hover:bg-[#D4AF37]/[0.02] transition-colors duration-500 -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: PROCESS / CRAFTSMANSHIP ===== */}
      <section className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden">
        {/* Subtle gold gradient pulse */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, rgba(5,5,5,0) 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-5"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              Artesanía
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Nuestro <em className="text-[#D4AF37]">Proceso</em>
            </h2>
            <div className="mt-6 mx-auto w-16 h-[1px] bg-[#D4AF37]/40" />
          </div>

          {/* Process steps */}
          <div ref={processRef} className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-[1px] bg-[rgba(212,175,55,0.15)]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={step.title}
                  data-process-step
                  className="relative flex flex-col items-center text-center opacity-0"
                >
                  {/* Step number */}
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505]">
                    {step.icon}
                  </div>
                  {/* Step number label */}
                  <p
                    className="text-xs text-[#D4AF37]/50 mb-2 uppercase tracking-[2px]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                  >
                    Paso {i + 1}
                  </p>
                  <h3
                    className="text-lg sm:text-xl text-white mb-3"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm text-[#8A8A8A] leading-relaxed max-w-xs"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: STATS / NUMBERS ===== */}
      <section
        ref={statsRef}
        className="relative w-full py-20 sm:py-28 md:py-36"
        style={{ background: "#0A0A0A" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {[
              { value: `+${counters.clientes}`, label: "Clientes satisfechos" },
              { value: `+${counters.piezas.toLocaleString()}`, label: "Piezas creadas" },
              { value: "100%", label: "Acero inoxidable premium" },
              { value: `+${counters.anos}`, label: "Años de experiencia" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] tracking-tight"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs uppercase tracking-[2px] text-[#8A8A8A] mt-4"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: VALUES / WHAT MAKES US DIFFERENT ===== */}
      <section className="relative w-full py-24 sm:py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-5"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              Diferencia
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Lo que nos hace <em className="text-[#D4AF37]">únicos</em>
            </h2>
          </div>

          <div
            ref={valuesRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {VALUES.map((item) => (
              <div
                key={item.title}
                data-value-item
                className="group relative p-6 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#050505]/50 hover:border-[rgba(212,175,55,0.12)] hover:-translate-y-1 transition-all duration-500 opacity-0"
              >
                <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {item.icon}
                </div>
                <h3
                  className="text-base sm:text-lg text-white font-medium mb-2"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-[#8A8A8A] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  {item.desc}
                </p>
                <div className="absolute inset-0 rounded-xl bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/[0.02] transition-colors duration-500 -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: CTA SECTION ===== */}
      <section ref={ctaRef} className="relative overflow-hidden px-6 py-24 md:py-32 opacity-0">
        {/* Radial gold gradient pulse */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0) 70%)",
          }}
        />

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/30 pointer-events-none"
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
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Quieres ser parte de nuestra{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
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
            className="text-base sm:text-lg text-[#8A8A8A] mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Únete a nuestra comunidad y sé la primera en conocer nuevas colecciones,
            piezas exclusivas y ofertas especiales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/colecciones"
              className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
              style={{
                fontFamily: "var(--font-inter)",
                background: "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
                color: "#050505",
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
              className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Contactar
            </a>
            <a
              href="https://instagram.com/dubraska.mago"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "var(--font-inter)" }}
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
    </div>
  )
}
