"use client"

import Link from "next/link"

interface CartSummaryProps {
  items: Array<{
    id: string
    productId: string
    quantity: number
    product: { price: number }
  }>
  subtotal: number
}

export default function CartSummary({ items, subtotal }: CartSummaryProps) {
  const shippingNote = "El envío se calculará en el checkout"

  return (
    <div className="rounded-xl bg-[var(--color-dark-card)] border border-white/5 p-6 flex flex-col gap-5">
      <h2
        className="text-lg font-semibold text-white"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Resumen del pedido
      </h2>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span style={{ fontFamily: "var(--font-inter)" }} className="text-[var(--color-muted)]">
            Subtotal ({items.length} {items.length === 1 ? "artículo" : "artículos"})
          </span>
          <span
            className="text-white font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ fontFamily: "var(--font-inter)" }} className="text-[var(--color-muted)]">
            Envío
          </span>
          <span
            className="text-[var(--color-muted)] italic text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {shippingNote}
          </span>
        </div>

        <div className="border-t border-white/10 pt-3 flex justify-between">
          <span
            className="text-white font-semibold"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Total
          </span>
          <span
            className="text-[var(--color-gold)] text-lg font-bold"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="flex items-center justify-center w-full py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold hover:brightness-110 transition-all"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Proceder al checkout
      </Link>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span style={{ fontFamily: "var(--font-inter)" }}>Pago seguro</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span style={{ fontFamily: "var(--font-inter)" }}>Envío a toda Venezuela</span>
        </div>
      </div>
    </div>
  )
}
