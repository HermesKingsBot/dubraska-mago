"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useWishlist } from "@/context/WishlistContext"
import { useRouter } from "next/navigation"

interface HeartButtonProps {
  productId: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { button: "w-8 h-8", icon: 14 },
  md: { button: "w-10 h-10", icon: 18 },
  lg: { button: "w-12 h-12", icon: 22 },
}

export default function HeartButton({ productId, size = "md", className = "" }: HeartButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const [tooltip, setTooltip] = useState<"add" | "remove">("add")

  const inWishlist = isInWishlist(productId)
  const { button: sizeClass, icon: iconSize } = SIZES[size]

  const handleClick = async () => {
    const isAuth = document.cookie.includes("dubraska_auth")
    if (!isAuth) {
      router.push("/login")
      return
    }
    if (inWishlist) {
      await removeFromWishlist(productId)
      setTooltip("add")
    } else {
      await addToWishlist(productId)
      setTooltip("remove")
    }
  }

  return (
    <div className={`relative group ${className}`}>
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.8 }}
        className={`${sizeClass} flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors`}
        onMouseEnter={() => setTooltip(inWishlist ? "remove" : "add")}
        aria-label={inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={inWishlist ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {inWishlist ? (
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="var(--color-rose)"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2 py-1 text-[10px] rounded bg-black/80 text-white z-10">
        {tooltip === "add" ? "Agregar a favoritos" : "Quitar de favoritos"}
      </div>
    </div>
  )
}
