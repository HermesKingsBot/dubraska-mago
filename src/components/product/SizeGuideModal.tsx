"use client"

import { motion, AnimatePresence } from "motion/react"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category: string
}

const SIZE_DATA: Record<string, { label: string; rows: string[][] }> = {
  anillos: {
    label: "Guía de Tallas - Anillos",
    rows: [
      ["Talla", "Diámetro (mm)", "Circunferencia (mm)"],
      ["48", "15.3", "48"],
      ["50", "15.9", "50"],
      ["52", "16.5", "52"],
      ["54", "17.2", "54"],
      ["56", "17.8", "56"],
    ],
  },
  collares: {
    label: "Guía de Tallas - Collares",
    rows: [
      ["Longitud", "Descripción"],
      ["40cm", "Ajustado al cuello"],
      ["45cm", "Caída estándar"],
      ["50cm", "Caída larga"],
    ],
  },
  pulseras: {
    label: "Guía de Tallas - Pulseras",
    rows: [
      ["Talla", "Muñeca (cm)"],
      ["S", "14 - 15.5"],
      ["M", "15.5 - 17"],
      ["L", "17 - 18.5"],
    ],
  },
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  const data = SIZE_DATA[category] || SIZE_DATA.anillos

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-[var(--color-dark-card)] border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3
                className="text-lg text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {data.label}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                {data.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={i === 0 ? "border-b border-white/10" : "border-b border-white/5"}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-3 px-4 ${
                          i === 0
                            ? "text-[var(--color-gold)] font-medium"
                            : "text-[var(--color-muted)]"
                        } ${j === 0 ? "font-medium text-white" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            </div>

            <div className="p-6 pt-0">
              <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                Si no estás seguro de tu talla, mide tu dedo o muñeca con un flexómetro y compara con las medidas de la tabla.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
