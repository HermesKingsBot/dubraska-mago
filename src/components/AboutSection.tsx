"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (context, contextSafe) => {
      if (!sectionRef.current) return

      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px)", () => {
        if (photoRef.current) {
          gsap.fromTo(
            photoRef.current,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const decorBoxes = photoRef.current?.querySelectorAll(".deco-box")
        if (decorBoxes?.length) {
          gsap.fromTo(
            decorBoxes,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              delay: 0.3,
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { x: 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (quoteRef.current) {
          gsap.fromTo(
            quoteRef.current,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: quoteRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const paragraphs = textRef.current?.querySelectorAll(".about-text-p")
        if (paragraphs?.length) {
          gsap.fromTo(
            paragraphs,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: paragraphs[0],
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const signature = textRef.current?.querySelector(".about-signature")
        if (signature) {
          gsap.fromTo(
            signature,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: signature,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const statItems = statsRef.current?.querySelectorAll(".stat-item")
        if (statItems?.length) {
          gsap.fromTo(
            statItems,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(max-width: 1023px)", () => {
        if (photoRef.current) {
          gsap.fromTo(
            photoRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.15,
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const paragraphs = textRef.current?.querySelectorAll(".about-text-p")
        if (paragraphs?.length) {
          gsap.fromTo(
            paragraphs,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: paragraphs[0],
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const statItems = statsRef.current?.querySelectorAll(".stat-item")
        if (statItems?.length) {
          gsap.fromTo(
            statItems,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([photoRef.current, textRef.current, quoteRef.current, statsRef.current], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[var(--color-bg)]">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-8"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
        >
          Hola, soy Dubraska
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-2px] max-w-4xl mx-auto"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Cada pieza cuenta una historia.{" "}
          <em className="text-[var(--color-gold)]">La tuya</em> empieza aquí.
        </motion.h2>

        <div className="mt-16 sm:mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative px-0">
            <div
              ref={photoRef}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.15)] group-hover:border-[rgba(212,175,55,0.35)] transition-colors duration-500 z-10" />

              <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.2_0.04_80)] via-[var(--color-dark-card)] to-[oklch(0.1_0.01_60)]">
                <Image
                  src="/images/dubraska-placeholder.svg"
                  alt="Dubraska Mago — Fundadora"
                  fill
                  className="object-cover opacity-30"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-[var(--color-gold)]/30 flex items-center justify-center mb-6 bg-[var(--color-gold)]/5">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="0.7" opacity="0.7">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <p
                    className="text-[var(--color-gold)]/60 text-base tracking-[4px] uppercase"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    Dubraska Mago
                  </p>
                  <p
                    className="text-white/25 text-xs tracking-[2px] uppercase mt-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Fundadora & Diseñadora
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <p
                  className="text-[var(--color-gold)] text-lg tracking-wide"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Dubraska Mago
                </p>
                <p
                  className="text-white/50 text-xs uppercase tracking-[2px] mt-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Fundadora & Diseñadora
                </p>
              </div>
            </div>

            <div className="deco-box hidden lg:block absolute -bottom-4 -right-4 w-32 h-32 border border-[rgba(212,175,55,0.06)] rounded-2xl -z-10" />
            <div className="deco-box hidden lg:block absolute -top-4 -left-4 w-24 h-24 border border-[rgba(212,175,55,0.04)] rounded-2xl -z-10" />
          </div>

          <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center">
            <div
              ref={quoteRef}
              className="text-7xl text-[var(--color-gold)]/10 leading-none mb-2 select-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              &ldquo;
            </div>

            <div className="space-y-6">
              <p
                className="about-text-p text-base sm:text-lg text-[oklch(0.76_0_0)] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Todo comenzó con una idea simple: que toda mujer merece sentirse{" "}
                <span className="text-white font-medium">especial</span> sin importar su
                presupuesto. Nací en Venezuela, donde la creatividad y la resiliencia son
                parte de nuestra esencia.
              </p>

              <p
                className="about-text-p text-base sm:text-lg text-[oklch(0.76_0_0)] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Cada pieza que diseño está pensada para ti — para tu día a día, para ese
                momento especial, para cuando quieras sentirte{" "}
                <span className="text-white font-medium">única</span>. Acero inoxidable
                bañado en oro 18K que brilla con fuerza.
              </p>

              <p
                className="about-text-p text-base sm:text-lg text-[oklch(0.76_0_0)] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Esto no es solo bisutería. Es una{" "}
                <span className="text-[var(--color-gold)] font-medium">extensión de tu personalidad</span>.
              </p>
            </div>

            <div className="about-signature mt-12 sm:mt-16 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[var(--color-gold)]/40" />
              <p
                className="text-[var(--color-gold)] text-lg italic"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Con cariño, Dubraska ✦
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="mt-10"
            >
              <a
                href="/nosotros"
                className="inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-medium border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 tracking-wide group"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Conoce nuestra historia
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
            </motion.div>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-10 sm:pt-14 border-t border-[rgba(255,255,255,0.06)]"
        >
          {[
            { number: "500+", label: "Clientas felices" },
            { number: "100%", label: "Acero inoxidable" },
            { number: "18K", label: "Baño de oro" },
            { number: "🇻🇪", label: "Envíos nacionales" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <p
                className="text-3xl sm:text-4xl text-[var(--color-gold)] tracking-tight"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {stat.number}
              </p>
              <p
                className="text-xs uppercase tracking-[2px] text-[var(--color-muted)] mt-3"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-[var(--color-gold)] origin-center"
      />
    </section>
  )
}
