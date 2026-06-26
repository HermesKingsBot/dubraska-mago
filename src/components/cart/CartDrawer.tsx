"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import EmptyStates from "@/components/EmptyStates"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [prevTotal, setPrevTotal] = useState(cartTotal)
  const [displayTotal, setDisplayTotal] = useState(cartTotal)
  const totalRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (cartTotal !== prevTotal) {
      const start = prevTotal
      const end = cartTotal
      const duration = 600
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayTotal(start + (end - start) * eased)
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
      setPrevTotal(cartTotal)
    }
  }, [cartTotal, prevTotal])

  const handleRemove = useCallback(
    async (id: string) => {
      if (confirmDeleteId === id) {
        setRemovingId(id)
        await removeFromCart(id)
        setRemovingId(null)
        setConfirmDeleteId(null)
      } else {
        setConfirmDeleteId(id)
        setTimeout(() => setConfirmDeleteId(null), 3000)
      }
    },
    [confirmDeleteId, removeFromCart]
  )

  const handleQuantity = useCallback(
    async (id: string, delta: number) => {
      const item = cartItems.find((i) => i.id === id)
      if (!item) return
      const newQty = Math.max(1, item.quantity + delta)
      await updateQuantity(id, newQty)
    },
    [cartItems, updateQuantity]
  )

  const handleWhatsApp = () => {
    const items = cartItems
      .map(
        (i) =>
          `${i.product?.name || "Producto"} x${i.quantity} - $${(Number(i.product?.price || 0) * i.quantity).toFixed(2)}`
      )
      .join("%0A")
    const total = cartTotal.toFixed(2)
    const msg = encodeURIComponent(
      `Hola! Me gustaría hacer un pedido:%0A%0A${items}%0A%0ATotal: $${total}`
    )
    window.open(`https://wa.me/584141234567?text=${msg}`, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-bg)] border-l border-white/5 z-50 flex flex-col"
            style={{ willChange: "transform" }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Tu carrito (
                <motion.span
                  key={cartItems.length}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block"
                >
                  {cartItems.length}
                </motion.span>
                )
              </h2>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[var(--color-muted)] hover:text-white"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                aria-label="Cerrar carrito"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <EmptyStates variant="empty-cart" onAction={onClose} />
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{
                          opacity: removingId === item.id ? 0 : 1,
                          x: removingId === item.id ? 60 : 0,
                          height: removingId === item.id ? 0 : "auto",
                        }}
                        exit={{ opacity: 0, x: 60, height: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                        className="flex gap-3 p-3 rounded-xl bg-[var(--color-dark-card)] border border-white/5 overflow-hidden"
                      >
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
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {item.product?.name || "Producto"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors text-xs"
                                aria-label="Reducir cantidad"
                              >
                                -
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                className="text-xs text-white min-w-[16px] text-center"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors text-xs"
                                aria-label="Aumentar cantidad"
                              >
                                +
                              </motion.button>
                            </div>
                            <span
                              className="text-xs text-[var(--color-gold)] font-semibold"
                              style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                              ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleRemove(item.id)}
                            animate={
                              confirmDeleteId === item.id
                                ? {
                                    x: [0, -3, 3, -3, 3, 0],
                                    transition: { duration: 0.4 },
                                  }
                                : {}
                            }
                            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                              confirmDeleteId === item.id
                                ? "bg-red-500/20 text-red-400"
                                : "text-[var(--color-muted)] hover:text-red-400 hover:bg-white/5"
                            }`}
                            aria-label={
                              confirmDeleteId === item.id
                                ? "Confirmar eliminación"
                                : "Eliminar"
                            }
                          >
                            {confirmDeleteId === item.id ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                    className="text-[var(--color-muted)]"
                  >
                    Total
                  </span>
                  <span
                    ref={totalRef}
                    className="text-[var(--color-gold)] font-bold"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    ${displayTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/carrito"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-xl border border-white/10 text-white text-xs font-medium hover:bg-white/5 transition-colors"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Ver carrito
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-semibold hover:brightness-110 transition-all"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Checkout
                  </Link>
                </div>
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl bg-[oklch(0.75_0.18_155)] text-white text-xs font-semibold transition-all"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] animate-[shine_3s_ease-in-out_infinite]" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Preguntar por WhatsApp
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
