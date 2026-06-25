"use client"

import { motion } from "motion/react"

export default function ReviewSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h4
            className="text-sm text-white font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ¡Gracias por tu reseña!
          </h4>
          <p
            className="text-xs text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Tu reseña será visible después de ser aprobada por nuestro equipo.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
