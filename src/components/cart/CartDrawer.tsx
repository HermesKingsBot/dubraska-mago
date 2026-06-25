"use client"

import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartTotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-bg)] border-l border-white/5 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Tu carrito ({cartItems.length})
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[var(--color-muted)] hover:text-white"
                aria-label="Cerrar carrito"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-muted)]">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p
                    className="text-[var(--color-muted)] text-sm"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Tu carrito está vacío
                  </p>
                  <Link
                    href="/colecciones"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-semibold hover:brightness-110 transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Explorar catálogo
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-[var(--color-dark-card)] border border-white/5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-dark-accent)]">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-[10px]">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <p
                          className="text-xs text-white truncate"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {item.product?.name || "Producto"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] text-[var(--color-muted)]"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            x{item.quantity}
                          </span>
                          <span
                            className="text-xs text-[var(--color-gold)] font-semibold"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span style={{ fontFamily: "var(--font-inter)" }} className="text-[var(--color-muted)]">
                    Total
                  </span>
                  <span
                    className="text-[var(--color-gold)] font-bold"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/carrito"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Ver carrito
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-semibold hover:brightness-110 transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
