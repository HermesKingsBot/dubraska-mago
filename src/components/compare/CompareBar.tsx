"use client"

import { motion, AnimatePresence } from "motion/react"
import { useCompare } from "@/context/CompareContext"

export default function CompareBar() {
  const { compareIds, compareCount, removeFromCompare, clearCompare } = useCompare()

  if (compareCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-dark-card)]/95 backdrop-blur-md border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-sm text-white font-medium"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Comparar ({compareCount}/4)
            </span>
            <div className="flex items-center gap-2">
              {compareIds.map((id) => (
                <div
                  key={id}
                  className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => removeFromCompare(id)}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 text-xs text-[var(--color-muted)] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Limpiar
            </button>
            <a
              href="/comparar"
              className="px-4 py-2 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:scale-[1.03] transition-transform"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Comparar ({compareCount})
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
