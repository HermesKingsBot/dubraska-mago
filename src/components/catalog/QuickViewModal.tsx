"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Product } from "@/types/product"
import Link from "next/link"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const COLOR_MAP: Record<string, string> = {
  dorado: "var(--color-gold)",
  plateado: "oklch(0.82 0 0)",
  rose: "var(--color-rose)",
  negro: "var(--color-dark-accent)",
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleEscape])

  useEffect(() => {
    setSelectedImage(0)
  }, [product])

  if (!product) return null

  const discount =
    product.oldPrice && product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose()
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl bg-[var(--color-bg)] rounded-2xl border border-white/10 overflow-hidden"
            style={{ willChange: "transform" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:rotate-90 transition-transform duration-300"
              aria-label="Cerrar vista rápida"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-[var(--color-dark-card)] relative overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded ${
                      product.badge === "OFERTA"
                        ? "bg-red-500/90 text-white"
                        : product.badge === "NUEVO"
                        ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {product.badge}
                  </span>
                )}
                {discount && (
                  <span
                    className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {product.category}
                  </p>
                  <h3
                    className="text-white text-lg"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="text-[var(--color-gold)] text-xl font-semibold"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    ${(product.price ?? 0).toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span
                      className="text-[var(--color-muted)] text-sm line-through"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{
                      backgroundColor: product.color
                        ? COLOR_MAP[product.color]
                        : "var(--color-muted)",
                    }}
                  />
                  <span
                    className="text-xs text-[var(--color-muted)]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {product.material}
                  </span>
                </div>

                {product.inStock ? (
                  <span
                    className="text-xs text-green-400"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    En stock
                  </span>
                ) : (
                  <span
                    className="text-xs text-red-400"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Agotado
                  </span>
                )}

                <div className="flex gap-3 mt-auto pt-4">
                  <Link
                    href={`/producto/${product.slug}`}
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-semibold hover:brightness-110 transition-all"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Ver detalles
                  </Link>
                  <button
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 transition-colors"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
