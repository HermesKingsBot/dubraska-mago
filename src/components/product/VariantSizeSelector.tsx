"use client"

import type { ProductVariant } from "@/types/product"

interface VariantSizeSelectorProps {
  variants: ProductVariant[]
  selectedColor: string | null
  selectedSize: string | null
  onSelectSize: (size: string) => void
}

function getSizesForColor(
  variants: ProductVariant[],
  color: string | null
): string[] {
  const filtered = color
    ? variants.filter((v) => v.color === color)
    : variants
  const sizes = filtered
    .map((v) => v.size)
    .filter((s): s is string => s !== null && s !== undefined)
  return [...new Set(sizes)]
}

function isSizeInStock(
  variants: ProductVariant[],
  color: string | null,
  size: string
): boolean {
  const match = variants.find(
    (v) => v.color === color && v.size === size && v.active
  )
  return match ? match.inStock : false
}

function getVariantForSize(
  variants: ProductVariant[],
  color: string | null,
  size: string
): ProductVariant | undefined {
  return variants.find(
    (v) => v.color === color && v.size === size && v.active
  )
}

function VariantSizeSelector({
  variants,
  selectedColor,
  selectedSize,
  onSelectSize,
}: VariantSizeSelectorProps): React.JSX.Element {
  const sizes = getSizesForColor(variants, selectedColor)
  const selectedVariant = getVariantForSize(variants, selectedColor, selectedSize || "")

  if (sizes.length === 0) return <></>

  return (
    <div className="mb-4">
      <span
        className="text-sm text-white block mb-2"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Talla: {selectedSize || "Selecciona"}
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const inStock = isSizeInStock(variants, selectedColor, size)
          const isSelected = selectedSize === size
          return (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              disabled={!inStock}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                isSelected
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : inStock
                    ? "border-white/10 text-[var(--color-muted)] hover:border-white/30"
                    : "border-white/5 text-[var(--color-muted)]/40 line-through cursor-not-allowed"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {size}
            </button>
          )
        })}
      </div>
      {selectedVariant && selectedVariant.price && (
        <span
          className="text-sm text-[var(--color-gold)] mt-2 block"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Precio: ${selectedVariant.price.toFixed(2)}
        </span>
      )}
    </div>
  )
}

export default VariantSizeSelector
