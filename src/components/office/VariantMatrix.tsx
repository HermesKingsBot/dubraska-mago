"use client"

import React, { useState } from "react"
import { COLORS, PRODUCT_SIZE_MAP } from "@/types/product"
import type { ProductVariant } from "@/types/product"
import VariantForm from "./VariantForm"

interface VariantMatrixProps {
  variants: ProductVariant[]
  basePrice: number
  baseSku: string
  onVariantsChange: (variants: ProductVariant[]) => void
  categoryName: string
}

function generateSku(
  baseSku: string,
  color: string | null,
  size: string | null
): string {
  const parts = [baseSku]
  if (color) parts.push(color.slice(0, 3).toUpperCase())
  if (size) parts.push(size.replace(/\s+/g, "").toUpperCase())
  return parts.join("-")
}

function VariantMatrix({
  variants,
  basePrice,
  baseSku,
  onVariantsChange,
  categoryName,
}: VariantMatrixProps): React.JSX.Element {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    PRODUCT_SIZE_MAP[categoryName] || []
  )
  const [newColorInput, setNewColorInput] = useState("")
  const [newSizeInput, setNewSizeInput] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const addColor = (color: string) => {
    if (color && !selectedColors.includes(color)) {
      setSelectedColors((prev) => [...prev, color])
    }
  }

  const removeColor = (color: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color))
  }

  const addSize = (size: string) => {
    if (size && !selectedSizes.includes(size)) {
      setSelectedSizes((prev) => [...prev, size])
    }
  }

  const removeSize = (size: string) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== size))
  }

  const generateAll = () => {
    const newVariants: ProductVariant[] = []
    const colors = selectedColors.length > 0 ? selectedColors : [null]
    const sizes = selectedSizes.length > 0 ? selectedSizes : [null]

    for (const color of colors) {
      for (const size of sizes) {
        const existing = variants.find(
          (v) => v.color === color && v.size === size
        )
        if (!existing) {
          newVariants.push({
            id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            productId: "",
            sku: generateSku(baseSku, color, size),
            name: [color, size].filter(Boolean).join(" + ") || "Variante",
            color,
            colorHex: color
              ? COLORS.find((c) => c.value === color)?.hex || null
              : null,
            size,
            material: null,
            price: null,
            oldPrice: null,
            stock: 0,
            lowStock: 5,
            weight: null,
            image: null,
            gallery: [],
            inStock: false,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        } else {
          newVariants.push(existing)
        }
      }
    }

    const keptExisting = variants.filter(
      (v) =>
        !newVariants.some(
          (nv) => nv.color === v.color && nv.size === v.size
        )
    )
    onVariantsChange([...keptExisting, ...newVariants])
  }

  const addSingleVariant = () => {
    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      productId: "",
      sku: baseSku,
      name: "Nueva variante",
      color: null,
      colorHex: null,
      size: null,
      material: null,
      price: null,
      oldPrice: null,
      stock: 0,
      lowStock: 5,
      weight: null,
      image: null,
      gallery: [],
      inStock: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onVariantsChange([...variants, newVariant])
    setExpandedId(newVariant.id)
  }

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    onVariantsChange(
      variants.map((v) => (v.id === id ? { ...v, ...updates } : v))
    )
  }

  const removeVariant = (id: string) => {
    onVariantsChange(variants.filter((v) => v.id !== id))
  }

  return (
    <div className="space-y-4 p-4 rounded-xl border border-[#333] bg-[#0d0d0d]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg text-white font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Variantes de Producto
        </span>
        <span className="text-xs text-[var(--color-muted)]">({variants.length} variantes)</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Colores</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedColors.map((color) => {
              const preset = COLORS.find((c) => c.value === color)
              return (
                <span
                  key={color}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#333] text-sm text-white"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset?.hex || "#888" }}
                  />
                  {preset?.label || color}
                  <button
                    onClick={() => removeColor(color)}
                    className="text-[var(--color-muted)] hover:text-red-400 text-xs"
                  >
                    X
                  </button>
                </span>
              )
            })}
          </div>
          <div className="flex gap-2">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) addColor(e.target.value)
              }}
              className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
            >
              <option value="">Agregar color predefinido</option>
              {COLORS.filter((c) => !selectedColors.includes(c.value)).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={newColorInput}
              onChange={(e) => setNewColorInput(e.target.value)}
              placeholder="Color personalizado"
              className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
            />
            <button
              onClick={() => {
                if (newColorInput) {
                  addColor(newColorInput.toLowerCase())
                  setNewColorInput("")
                }
              }}
              className="px-3 py-2 text-sm rounded-lg bg-[#1a1a1a] border border-[#333] text-white hover:border-[var(--color-gold)] transition-colors"
            >
              + 
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Tallas</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#333] text-sm text-white"
              >
                {size}
                <button
                  onClick={() => removeSize(size)}
                  className="text-[var(--color-muted)] hover:text-red-400 text-xs"
                >
                  X
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSizeInput}
              onChange={(e) => setNewSizeInput(e.target.value)}
              placeholder="Talla (ej: S, M, L)"
              className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none flex-1"
            />
            <button
              onClick={() => {
                if (newSizeInput) {
                  const parts = newSizeInput.split(",").map((s) => s.trim()).filter(Boolean)
                  parts.forEach((s) => addSize(s))
                  setNewSizeInput("")
                }
              }}
              className="px-3 py-2 text-sm rounded-lg bg-[#1a1a1a] border border-[#333] text-white hover:border-[var(--color-gold)] transition-colors"
            >
              + 
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generateAll}
          disabled={selectedColors.length === 0 && selectedSizes.length === 0}
          className="px-4 py-2 text-sm rounded-lg bg-[var(--color-gold)] text-black font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generar todas las combinaciones
        </button>
        <button
          onClick={addSingleVariant}
          className="px-4 py-2 text-sm rounded-lg border border-[#333] text-white hover:border-[var(--color-gold)] transition-colors"
        >
          + Variante individual
        </button>
      </div>

      {variants.length > 0 && (
        <div className="space-y-3 mt-4">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="rounded-lg border border-[#333] bg-[#111] overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === variant.id ? null : variant.id)
                }
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {variant.colorHex && (
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  )}
                  <span className="text-sm text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {variant.name}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    SKU: {variant.sku}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    Stock: {variant.stock}
                  </span>
                  {!variant.active && (
                    <span className="text-xs text-red-400">Inactivo</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeVariant(variant.id)
                    }}
                    className="text-xs text-[var(--color-muted)] hover:text-red-400 px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                  <svg
                    className={`w-4 h-4 text-[var(--color-muted)] transition-transform ${expandedId === variant.id ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              {expandedId === variant.id && (
                <div className="px-4 pb-4 border-t border-[#222]">
                  <VariantForm
                    variant={variant}
                    onChange={(updates) => updateVariant(variant.id, updates)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VariantMatrix
