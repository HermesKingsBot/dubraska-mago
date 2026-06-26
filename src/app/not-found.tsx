"use client"

import { motion } from "motion/react"
import Link from "next/link"
import ErrorOrnament from "@/components/ErrorOrnament"
import ErrorSearch from "@/components/ErrorSearch"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const EXPLORE_LINKS = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
  { label: "FAQ", href: "/preguntas-frecuentes" },
]

function NotFoundPage(): React.JSX.Element {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, var(--color-gold), transparent 70%)",
        }}
      />

      <ErrorOrnament size={64} className="mb-10" />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="text-7xl sm:text-8xl md:text-9xl font-normal tracking-tight text-[var(--color-gold)]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="text-xl sm:text-2xl mt-6 text-white"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Página no encontrada
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="text-sm sm:text-base max-w-md mt-4 leading-relaxed text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
      >
        Como una joya perdida, esta página no está en nuestra colección. La página que buscas no existe o fue movida.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        className="mt-10 w-full max-w-md"
      >
        <ErrorSearch />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <motion.a
          href="/"
          whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(212,175,55,0.35)" }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] inline-block"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Volver al inicio
        </motion.a>

        <motion.a
          href="/colecciones"
          whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-10 py-4 text-sm font-semibold tracking-wide border border-white/15 bg-transparent text-white hover:text-[var(--color-gold)] transition-colors duration-300 inline-block"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Ver colección
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
        className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <span>O explora:</span>
        {EXPLORE_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-[var(--color-gold)]/40">·</span>}
            <Link
              href={link.href}
              className="text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors duration-300 underline underline-offset-2 decoration-white/10 hover:decoration-[var(--color-gold)]/40"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1, ease: EASE }}
        className="mt-16 flex items-center gap-3"
      >
        <div className="w-12 h-px bg-[var(--color-gold)]" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[var(--color-gold)]" />
        <div className="w-12 h-px bg-[var(--color-gold)]" />
      </motion.div>
    </section>
  )
}

export default NotFoundPage
