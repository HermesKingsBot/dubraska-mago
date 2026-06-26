"use client"

import { motion } from "motion/react"

export default function CompareEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-4"
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-[var(--color-dark-card)] border border-white/10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v6m0 0H3m6 0h12M3 9v10a2 2 0 002 2h4m-6-12h12m0 0v10a2 2 0 01-2 2h-4m6-12H9m0 12v-6m0 0H3" />
        </svg>
      </div>

      <h2
        className="text-2xl text-white mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Comparar Productos
      </h2>

      <p
        className="text-sm text-[var(--color-muted)] text-center max-w-md mb-2"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Selecciona 2 o 4 productos del catálogo para comparar sus características lado a lado.
      </p>

      <p
        className="text-xs text-[var(--color-muted)] text-center max-w-sm mb-8"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Haz clic en el ícono de comparación en cualquier producto del catálogo para agregarlo a tu lista de comparación.
      </p>

      <a
        href="/colecciones"
        className="px-8 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:scale-[1.03] transition-transform"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Explorar Catálogo
      </a>
    </motion.div>
  )
}
