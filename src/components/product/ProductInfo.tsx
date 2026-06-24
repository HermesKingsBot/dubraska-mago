"use client"

import { forwardRef } from "react"
import { Product } from "@/types/product"

const COLOR_MAP: Record<string, string> = {
  dorado: "#D4AF37",
  plateado: "#C0C0C0",
  rose: "#E8B4B8",
  negro: "#1a1a1a",
}

interface ProductInfoProps {
  product: Product & {
    waterResistant: boolean
    dimensions: string
  }
  discount: number | null
}

const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(
  function ProductInfo({ product, discount }, ref) {
    return (
      <div ref={ref} className="flex flex-col">
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] mb-3"
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
            className="text-2xl sm:text-3xl text-[#D4AF37] font-semibold"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <>
              <span
                className="text-lg text-[#8A8A8A] line-through"
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

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: COLOR_MAP[product.color] }}
            />
            <span
              className="text-sm text-[#8A8A8A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm text-[#8A8A8A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.material}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#8A8A8A]" style={{ fontFamily: "var(--font-inter)" }}>
          {product.dimensions && (
            <span>Medidas: {product.dimensions}</span>
          )}
          {product.weight && <span>Peso: {product.weight}</span>}
        </div>

        {product.waterResistant && (
          <div className="flex items-center gap-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs text-[#D4AF37]" style={{ fontFamily: "var(--font-inter)" }}>
              Resistente al agua
            </span>
          </div>
        )}
      </div>
    )
  }
)

export default ProductInfo
