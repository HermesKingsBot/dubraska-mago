"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { useCart } from "@/context/CartContext"

interface CartItemProps {
  item: {
    id: string
    productId: string
    quantity: number
    product: {
      id: string
      name: string
      price: number
      image: string
      slug: string
    }
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart()

  const lineTotal = Number(item.product?.price || 0) * item.quantity

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 rounded-lg bg-[var(--color-dark-card)] border border-white/5"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-dark-accent)]">
        {item.product?.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-xs">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-medium text-white truncate"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {item.product?.name || "Producto"}
          </h3>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[var(--color-muted)] hover:text-white"
            aria-label="Eliminar producto"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--color-dark-accent)] hover:bg-white/10 transition-colors text-white text-sm"
            >
              -
            </button>
            <span
              className="w-8 text-center text-sm text-white"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--color-dark-accent)] hover:bg-white/10 transition-colors text-white text-sm"
            >
              +
            </button>
          </div>

          <span
            className="text-[var(--color-gold)] text-sm font-semibold"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            ${lineTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
