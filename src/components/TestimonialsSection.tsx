"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
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
    <section ref={sectionRef} className="relative w-full bg-[var(--color-bg)] py-16 sm:py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14 md:mb-18">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-4"
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
            className="text-base sm:text-lg text-[var(--color-muted)] mt-4 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Historias de mujeres que brillan con sus piezas Dubraska
          </p>
        </div>

        {testimonials.length > 0 && (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="testimonial-card group relative p-6 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[var(--color-dark-card)] hover:border-[rgba(212,175,55,0.1)] transition-all duration-500"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                </div>

                <p
                  className="text-sm text-[oklch(0.76_0_0)] leading-[1.8] italic"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center">
                    <span
                      className="text-xs text-[var(--color-gold)]/60 font-medium"
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            <span className="text-[var(--color-gold)]">✨</span>
          </p>
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-semibold bg-[var(--color-gold)] text-[var(--color-bg)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ver catálogo completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
