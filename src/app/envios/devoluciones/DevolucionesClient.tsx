"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CONDICIONES = [
  {
    number: "01",
    title: "Plazo de 7 días",
    description: "Tienes 7 días calendario desde la recepción del pedido para solicitar una devolución.",
  },
  {
    number: "02",
    title: "Estado original",
    description: "La pieza debe estar en estado original, sin uso, con su empaque intacto y todos los accesorios incluidos.",
  },
  {
    number: "03",
    title: "Daños por envío",
    description: "Si tu pieza llega con daño por transporte, toma fotografías al momento de recibir y repórtalo dentro de las primeras 24 horas.",
  },
  {
    number: "04",
    title: "Proceso de devolución",
    description: "Contáctanos por WhatsApp, envía las fotos del daño, realizaremos una evaluación y procedemos con reposición o reembolso.",
  },
  {
    number: "05",
    title: "Piezas personalizadas",
    description: "Las piezas personalizadas o alteradas bajo pedido no aplican para devolución.",
  },
  {
    number: "06",
    title: "Costo de envío de devolución",
    description: "Si el daño fue causado por el transporte, el costo del envío de devolución corre por nuestra cuenta.",
  },
]

export default function DevolucionesClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const disclaimerRef = useRef<HTMLDivElement>(null)

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
            { scaleX: 1, duration: 1.2, delay: 0.8, ease: "power2.inOut" }
          )
        }

        if (contentRef.current) {
          const items = contentRef.current.querySelectorAll("[data-condition]")
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
                  trigger: contentRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (disclaimerRef.current) {
          gsap.fromTo(
            disclaimerRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: disclaimerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = [heroRef.current, heroLineRef.current, contentRef.current, disclaimerRef.current].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroLineRef.current) gsap.set(heroLineRef.current, { scaleX: 1 })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-40 md:pb-28"
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1] tracking-[-2px] opacity-0"
          style={{
            fontFamily: "var(--font-playfair)",
            background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Política de Devoluciones
        </h1>
        <p
          className="text-base sm:text-lg max-w-2xl mt-6 leading-relaxed text-[var(--color-muted)] opacity-0"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
        >
          Tu satisfacción es nuestra prioridad. Conoce las condiciones para devolver o cambiar tu pieza.
        </p>
        <div
          ref={heroLineRef}
          className="mt-10 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
        />
      </section>

      <section ref={contentRef} className="px-6 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CONDICIONES.map((c) => (
            <div
              key={c.number}
              data-condition
              className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--color-dark-card)] p-6 sm:p-8 opacity-0"
            >
              <span
                className="text-xs font-semibold tracking-wider text-[var(--color-gold)]/60 block mb-3"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {c.number}
              </span>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {c.title}
              </h3>
              <p
                className="text-sm leading-relaxed text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section ref={disclaimerRef} className="px-6 py-16 md:py-20 max-w-3xl mx-auto text-center opacity-0">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--color-dark-card)] p-8 sm:p-10">
          <p
            className="text-sm text-[var(--color-muted)] mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Esta política aplica solo para compras realizadas en dubraskamago.com
          </p>

          <motion.a
            href="https://wa.me/584141234567"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "linear-gradient(135deg, var(--color-gold) 0%, #B8941F 100%)",
              color: "var(--color-bg)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contactar por WhatsApp
          </motion.a>
        </div>
      </section>
    </div>
  )
}
