"use client"

import { useState } from "react"
import type { ProductVariant } from "@/types/product"
import { COLORS } from "@/types/product"

interface VariantColorSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string | null
  onSelectVariant: (variantId: string) => void
}

function getUniqueColors(variants: ProductVariant[]) {
  const seen = new Map<string, { color: string; hex: string | null }>()
  for (const v of variants) {
    if (v.color && !seen.has(v.color)) {
      const preset = COLORS.find((c) => c.value === v.color)
      seen.set(v.color, {
        color: v.color,
        hex: v.colorHex || preset?.hex || "#888",
      })
    }
  }
  return Array.from(seen.values())
}

function getVariantsForColor(
  variants: ProductVariant[],
  color: string
): ProductVariant[] {
  return variants.filter((v) => v.color === color)
}

function isColorInStock(variants: ProductVariant[], color: string): boolean {
  const colorVariants = getVariantsForColor(variants, color)
  return colorVariants.some((v) => v.inStock && v.active)
}

function VariantColorSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantColorSelectorProps): React.JSX.Element {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const colors = getUniqueColors(variants)
  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const selectedColor = selectedVariant?.color || null

  const handleColorClick = (color: string) => {
    const colorVariants = getVariantsForColor(variants, color)
    if (colorVariants.length > 0) {
      const inStockVariant = colorVariants.find((v) => v.inStock && v.active)
      onSelectVariant(inStockVariant?.id || colorVariants[0].id)
    }
  }

  if (colors.length === 0) return <></>

  return (
    <div className="mb-4">
      <span
        className="text-sm text-white block mb-2"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Color:{" "}
        {selectedColor
          ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)
          : "Selecciona"}
      </span>
      <div className="flex items-center gap-3">
        {colors.map(({ color, hex }) => {
          const isSelected = selectedColor === color
          const inStock = isColorInStock(variants, color)
          return (
            <div key={color} className="relative">
              <button
                onClick={() => handleColorClick(color)}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--color-gold)] shadow-[0_0_8px_rgba(212,175,55,0.4)] scale-110"
                    : "border-white/20 hover:border-white/40"
                } ${!inStock ? "opacity-30" : ""}`}
                style={{ backgroundColor: hex ?? "var(--color-muted)" }}
                disabled={!inStock}
              />
              {!inStock && (
                <span className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-bold pointer-events-none">
                  X
                </span>
              )}
              {hoveredColor === color && (
                <span
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] bg-[#222] text-white rounded whitespace-nowrap z-10"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VariantColorSelector
