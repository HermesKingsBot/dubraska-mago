"use client"

import { motion } from "motion/react"

const NAV_ITEMS = [
  { label: "Inicio", href: "/", active: true },
  { label: "Colecciones", href: "/colecciones", active: false },
  { label: "Nosotros", href: "/nosotros", active: false },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes", active: false },
  { label: "Contacto", href: "/contacto", active: false },
]

export default function NavigationBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto backdrop-blur-sm bg-[var(--color-bg)]/20"
    >
      <a
        href="/"
        className="text-2xl md:text-3xl tracking-tight text-[var(--color-gold)] hover:text-[oklch(0.84_0.12_85)] transition-colors duration-300"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        DUBRASKA MAGO<sup className="text-xs">®</sup>
      </a>

      <ul className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className={`text-sm transition-colors duration-300 ${
                item.active
                  ? "text-white"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/colecciones"
        className="rounded-full px-6 py-2.5 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-bg)] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Catálogo
      </a>
    </motion.nav>
  )
}
