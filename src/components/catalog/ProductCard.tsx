"use client"

import { useRef, useState, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { motion } from "motion/react"
import { Product } from "@/types/product"
import { buildWhatsAppLink } from "@/lib/catalog-utils"
import HeartButton from "@/components/wishlist/HeartButton"
import CompareButton from "@/components/compare/CompareButton"

interface ProductCardProps {
  product: Product
  index: number
}

const COLOR_MAP: Record<string, string> = {
  dorado: "var(--color-gold)",
  plateado: "oklch(0.82 0 0)",
  rose: "var(--color-rose)",
  negro: "var(--color-dark-accent)",
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 })

  useGSAP(() => {
    if (!cardRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.05,
        ease: "power2.out",
      }
    )
  }, { scope: cardRef })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    setTiltStyle({ rotateX, rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({ rotateX: 0, rotateY: 0 })
  }, [])

  const discount = product.oldPrice && product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  const whatsappUrl = buildWhatsAppLink(product)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltStyle.rotateX,
        rotateY: tiltStyle.rotateY,
        y: 0,
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[var(--color-bg)] border border-white/5 hover:border-[var(--color-gold)]/30 transition-colors duration-300"
      style={{ perspective: 600, transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-dark-card)]">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          loading="lazy"
        />

        {product.badge && (
          <motion.span
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded ${
              product.badge === "OFERTA"
                ? "bg-red-500/90 text-white"
                : product.badge === "NUEVO"
                ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                : product.badge === "LIMITADO"
                ? "bg-white/10 text-white border border-white/20"
                : "bg-[var(--color-gold)]/90 text-[var(--color-bg)]"
            }`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {product.badge}
          </motion.span>
        )}

        {discount && (
          <span
            className="absolute top-3 right-14 px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            -{discount}%
          </span>
        )}

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <CompareButton productId={product.id} />
          <HeartButton productId={product.id} size="sm" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <motion.div
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.3 }}
        >
          <span
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/10 hover:bg-white/20 transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ver detalles
          </span>
        </motion.div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: product.color ? COLOR_MAP[product.color] : "var(--color-muted)" }}
          />
          <span
            className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {product.category}
          </span>
        </div>

        <h3
          className="text-white text-sm font-medium mb-1 line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors duration-300"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {product.name}
        </h3>

        <p
          className="text-[var(--color-muted)] text-xs mb-3 line-clamp-1"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {product.material}
        </p>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span
            className="text-[var(--color-gold)] text-lg font-semibold"
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

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[oklch(0.75_0.18_155)] text-white text-xs font-medium hover:bg-[oklch(0.72_0.17_150)] transition-colors"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Preguntar por WhatsApp
        </a>
      </div>
    </motion.div>
  )
}
