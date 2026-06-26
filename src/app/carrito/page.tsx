"use client"

import { useCart } from "@/context/CartContext"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import Link from "next/link"
import { AnimatePresence } from "motion/react"

export default function CarritoPage() {
  const { items: cartItems, cartTotal, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen py-24 px-4 max-w-6xl mx-auto">
      <h1
        className="text-3xl md:text-4xl font-bold text-white mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Carrito de compras
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-muted)]">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          <p
            className="text-[var(--color-muted)] text-lg"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Tu carrito está vacío
          </p>
          <Link
            href="/colecciones"
            className="px-6 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold hover:brightness-110 transition-all"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <div className="flex-1 flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>

              <Link
                href="/colecciones"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors mt-2 self-start"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Seguir comprando
              </Link>
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-28">
                <CartSummary items={cartItems} subtotal={cartTotal} />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
