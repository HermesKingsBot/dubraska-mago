"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import CartDrawer from "@/components/cart/CartDrawer"

function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-[10px] font-bold leading-none px-1">
      {count > 99 ? "99+" : count}
    </span>
  )
}

export function CartButton() {
  const [open, setOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
        aria-label="Carrito"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] hover:text-white transition-colors">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <Badge count={cartCount} />
      </button>
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

export function WishlistLink() {
  const { wishlistCount } = useWishlist()

  return (
    <Link
      href="/cuenta/wishlist"
      className="relative p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
      aria-label="Lista de deseos"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] hover:text-white transition-colors">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      <Badge count={wishlistCount} />
    </Link>
  )
}
