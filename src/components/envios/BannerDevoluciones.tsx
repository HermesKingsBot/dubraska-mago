"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface BannerDevolucionesProps {
  ref?: React.Ref<HTMLDivElement>
}

function BannerDevoluciones({ ref }: BannerDevolucionesProps): React.JSX.Element {
  const [shimmer, setShimmer] = useState(0)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number
    let start = 0
    const animate = () => {
      start += 0.008
      setShimmer(start)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  useGSAP(() => {
    if (!innerRef.current) return
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const border = innerRef.current
      if (border) {
        gsap.to(border, {
          backgroundPosition: "200% 0",
          duration: 3,
          ease: "none",
          repeat: -1,
        })
      }
    })
    return () => mm.revert()
  }, { scope: innerRef })

  const glowOpacity = 0.08 + Math.sin(shimmer * 2) * 0.04

  return (
    <section ref={ref} className="px-6 py-16 md:py-20 opacity-0">
      <div className="max-w-4xl mx-auto relative">
        <div
          className="absolute -inset-px rounded-2xl"
          ref={innerRef}
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            opacity: 0.3,
          }}
        />

        <div
          className="relative rounded-2xl p-8 sm:p-10 md:p-12 text-center"
          style={{
            background: `radial-gradient(ellipse at center, rgba(212,175,55,${glowOpacity}) 0%, var(--color-dark-card) 70%)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span
              className="text-[11px] font-medium text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Política de protección
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¿Llegó dañado tu pedido?{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-gold) 0%, #F5E6A3 50%, var(--color-gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tienes 7 días
            </span>{" "}
            para devolverlo
          </h2>

          <p
            className="text-sm sm:text-base text-[var(--color-muted)] mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Si tu pieza llega con daño por el envío, te reponemos o reembolsamos.
            Revisa nuestra política completa para conocer el proceso.
          </p>

          <motion.a
            href="/envios/devoluciones"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "linear-gradient(135deg, var(--color-gold) 0%, #B8941F 100%)",
              color: "var(--color-bg)",
            }}
          >
            Ver Política de Devoluciones
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default BannerDevoluciones
