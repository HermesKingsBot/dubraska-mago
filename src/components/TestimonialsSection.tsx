"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TESTIMONIALS = [
  {
    text: "Me encantó la calidad del collar. Pensé que por el precio sería básico, pero cuando lo recibí ¡quedé encantada! El oro no se ha despintado para nada y todo el mundo me pregunta dónde lo compré.",
    name: "María G.",
    location: "Caracas",
    stars: 5,
  },
  {
    text: "Compré el set de collar + pulsera para un evento y fue el centro de atención. La calidad es increíble, parecen de oro de verdad. Ya voy a encargar otro para mi mamá.",
    name: "Andrea L.",
    location: "Maracaibo",
    stars: 5,
  },
  {
    text: "Lo que más me gusta es la atención de Dubraska. Me ayudó a elegir el color perfecto para mi tono de piel. Los arees me llegaron súper rápido y hermosos.",
    name: "Carolina R.",
    location: "Valencia",
    stars: 5,
  },
  {
    text: "Soy alérgica a casi todos los metales y estas piezas no me causaron ninguna reacción. ¡Por fin encontré joyería bonita que puedo usar! Ya tengo 4 piezas.",
    name: "Daniela M.",
    location: "Barquisimeto",
    stars: 5,
  },
  {
    text: "Pedí la pulsera por WhatsApp, súper fácil. Dubraska me mandó fotos para que eligiera y al día siguiente ya la tenía. El envío fue rapidísimo.",
    name: "Laura P.",
    location: "Margarita",
    stars: 5,
  },
  {
    text: "Regalé el collar dorado en Navidad y mi hermana no se lo quita. Dice que es la joya más bonita que tiene. Calidad-precio imbatible, 100% recomendada.",
    name: "Gabriela S.",
    location: "Mérida",
    stars: 5,
  },
]

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".testimonial-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(max-width: 767px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".testimonial-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const _tc = cardsRef.current?.querySelectorAll(".testimonial-card")
        if (_tc) gsap.set(_tc, { opacity: 1, y: 0 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative w-full bg-[#050505] py-28 sm:py-36 md:py-44">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Nuestras clientas hablan
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-1px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Clientes felices
          </h2>
          <p
            className="text-base sm:text-lg text-[#8A8A8A] mt-4 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Historias de mujeres que brillan con sus piezas Dubraska
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testimonial-card group relative p-6 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#111] hover:border-[rgba(212,175,55,0.1)] transition-all duration-500"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm text-[#B0B0B0] leading-[1.8] italic"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                &ldquo;{t.text}&rdquo
              </p>

              {/* Author */}
              <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                  <span
                    className="text-xs text-[#D4AF37]/60 font-medium"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm text-white font-medium"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[11px] text-[#555]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p
            className="text-xl sm:text-2xl text-white mb-6"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Lista para ser nuestra próxima clienta feliz?{" "}
            <span className="text-[#D4AF37]">✨</span>
          </p>
          <a
            href="/colecciones"
            className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-semibold bg-[#D4AF37] text-[#050505] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ver catálogo completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
