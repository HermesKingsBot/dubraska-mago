"use client"

import Link from "next/link"
import Image from "next/image"
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId)
  }

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId)
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
      <h2
        className="text-2xl"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Mi Wishlist
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-12 text-center">
          <p className="text-[var(--color-muted)] mb-4">
            Tu wishlist está vacía
          </p>
          <Link
            href="/colecciones"
            className="inline-block bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Explorar Colecciones
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl overflow-hidden group"
            >
              <Link href={`/producto/${item.product?.slug || item.productId}`}>
                <div className="aspect-square bg-white/5 relative">
                  {item.product?.image && (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
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
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="flex-1 bg-[var(--color-gold)] text-black py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    title="Eliminar"
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
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
