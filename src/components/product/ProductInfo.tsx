"use client"

import { useState } from "react"
import { Product } from "@/types/product"
import SizeGuideModal from "./SizeGuideModal"

const COLOR_MAP: Record<string, string> = {
  dorado: "var(--color-gold)",
  plateado: "oklch(0.82 0.01 250)",
  rose: "var(--color-rose)",
  negro: "var(--color-dark-card)",
}

interface ProductInfoProps {
  product: Product & {
    waterResistant: boolean
    dimensions: string
  }
  discount: number | null
  selectedSize: string | null
  onSizeChange: (size: string) => void
  ref?: React.Ref<HTMLDivElement>
}

function ProductInfo({ product, discount, selectedSize, onSizeChange, ref }: ProductInfoProps): React.JSX.Element {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const sizes = Array.isArray(product.sizes) ? product.sizes : []

  return (
    <div ref={ref} className="flex flex-col">
      <span
        className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {product.category}
      </span>

      <h1
        className="text-3xl sm:text-4xl text-white mb-2 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        {product.name}
      </h1>

      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-2xl sm:text-3xl text-[var(--color-gold)] font-semibold"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ${(product.price ?? 0).toFixed(2)}
        </span>
        {product.oldPrice && (
          <>
            <span
              className="text-lg text-[var(--color-muted)] line-through"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ${product.oldPrice.toFixed(2)}
            </span>
            <span
              className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              -{discount}%
            </span>
          </>
        )}
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white" style={{ fontFamily: "var(--font-inter)" }}>
              Talla: {selectedSize || "Selecciona"}
            </span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs text-[var(--color-gold)] underline"
            >
              Guía de tallas
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                  selectedSize === size
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                    : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ backgroundColor: product.color ? COLOR_MAP[product.color] : "var(--color-muted)" }}
          />
          <span
            className="text-sm text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {product.color ? product.color.charAt(0).toUpperCase() + product.color.slice(1) : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-sm text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {product.material}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {product.dimensions && (
          <span>Medidas: {product.dimensions}</span>
        )}
        {product.weight && <span>Peso: {product.weight}</span>}
      </div>

      {product.waterResistant && (
        <div className="flex items-center gap-2 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs text-[var(--color-gold)]" style={{ fontFamily: "var(--font-inter)" }}>
            Resistente al agua
          </span>
        </div>
      )}

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  )
}

export default ProductInfo
