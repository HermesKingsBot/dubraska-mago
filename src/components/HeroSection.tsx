"use client"

import { useRef, useCallback } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { useSettingsContext } from "@/context/SettingsContext"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function HeroSection() {
  const { getSetting } = useSettingsContext()
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 60])
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.3, 0.7])

  const shippingEnabled = getSetting("shipping_enabled") === "true"
  const casheaEnabled = getSetting("cashea_enabled") === "true"
  const address = getSetting("address")

  const badges = [
    shippingEnabled ? "Envíos a toda Venezuela" : null,
    casheaEnabled ? "Aceptamos Cashea" : null,
    address || null,
  ].filter(Boolean)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ctaRef.current) return
    const rect = ctaRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    ctaRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!ctaRef.current) return
    ctaRef.current.style.transform = "translate(0, 0)"
    ctaRef.current.style.transition = "transform 0.4s ease"
    setTimeout(() => {
      if (ctaRef.current) ctaRef.current.style.transition = ""
    }, 400)
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 md:py-40 h-full" style={{ minHeight: "calc(100vh - 8rem)" }}>
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: bgY }}
      />

      <motion.div
        className="absolute inset-0 -z-10 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl font-normal leading-[1.05] tracking-[-2px] text-white"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Diseños que brillan más cuando{" "}
        <em className="text-[var(--color-gold)]">TÚ</em> los llevas puestos.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y
        hechas para tu día a día. Disfruta de pagos flexibles con Cashea y
        recibe tu pedido en cualquier rincón de Venezuela.
      </motion.p>

      <motion.a
        ref={ctaRef}
        href="/colecciones"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="rounded-full px-14 py-5 text-base font-semibold tracking-wide mt-12 border-none cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] inline-block"
        style={{ fontFamily: "var(--font-dm-sans)", willChange: "transform" }}
      >
        Ver Catálogo
      </motion.a>

      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="flex flex-wrap justify-center gap-6 mt-8"
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-xs text-[var(--color-muted)]/60"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 1.2, ease: EASE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-white/40"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
