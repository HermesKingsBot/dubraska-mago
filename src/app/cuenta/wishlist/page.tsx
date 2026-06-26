"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"
import EmptyStates from "@/components/EmptyStates"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist()
  const { addToCart } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null)

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId)
    setAddedToCartId(productId)
    setTimeout(() => setAddedToCartId(null), 2000)
  }

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    setTimeout(async () => {
      await removeFromWishlist(productId)
      setRemovingId(null)
    }, 300)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Mi Wishlist
        </h2>
        {wishlistItems.length > 0 && (
          <motion.span
            key={wishlistItems.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 rounded-full text-xs bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </motion.span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyStates variant="empty-wishlist" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: removingId === item.productId ? 0 : 1,
                  x: removingId === item.productId ? 60 : 0,
                  scale: removingId === item.productId ? 0.8 : 1,
                }}
                exit={{ opacity: 0, x: 60, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05,
                }}
                className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl overflow-hidden group"
              >
                <Link href={`/producto/${item.product?.slug || item.productId}`}>
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {item.product?.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link href={`/producto/${item.product?.slug || item.productId}`}>
                    <p className="text-sm font-medium truncate hover:text-[var(--color-gold)] transition-colors">
                      {item.product?.name || "Producto"}
                    </p>
                  </Link>
                  <p className="text-[var(--color-gold)] text-sm mt-1">
                    ${item.product?.price?.toFixed(2) || "0.00"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(item.productId)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all relative overflow-hidden"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        backgroundColor:
                          addedToCartId === item.productId
                            ? "oklch(0.75 0.18 155)"
                            : "var(--color-gold)",
                        color: "var(--color-bg)",
                      }}
                    >
                      {addedToCartId === item.productId ? (
                        <span className="flex items-center justify-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          ¡Agregado!
                        </span>
                      ) : (
                        "Agregar al carrito"
                      )}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleRemove(item.productId)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      aria-label="Eliminar de favoritos"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
