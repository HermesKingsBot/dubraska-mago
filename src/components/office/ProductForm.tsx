"use client"

import React, { useState } from "react"
import { CATEGORIES, COLORS, PRODUCT_SIZE_MAP } from "@/types/product"
import ToggleSwitch from "./ToggleSwitch"
import type { ProductVariant } from "@/types/product"

const BADGES = ["", "NUEVO", "SÚPER VENDIDO", "LIMITADO"]

interface ProductFormProps {
  form: {
    name: string
    category: string
    color: string
    price: number
    oldPrice: number
    material: string
    description: string
    length: string
    weight: string
    waterproof: boolean
    featured: boolean
    badge: string
    stock: number
    hasVariants: boolean
  }
  variants?: ProductVariant[]
  onVariantsChange?: (variants: ProductVariant[]) => void
  onChange: (updates: Partial<ProductFormProps["form"]>) => void
  onNameChange: (val: string) => void
}

const inputClass =
  "w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors"

function ProductForm({
  form,
  variants,
  onVariantsChange,
  onChange,
  onNameChange,
}: ProductFormProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onNameChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Categoría</label>
        <select
          value={form.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 py-2">
        <ToggleSwitch
          checked={form.hasVariants}
          onChange={(v) => onChange({ hasVariants: v })}
        />
        <span className="text-sm text-[var(--color-muted)]">Este producto tiene variantes (color/talla)</span>
      </div>

      {!form.hasVariants && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Color</label>
              <select
                value={form.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className={inputClass}
              >
                {COLORS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Material</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => onChange({ material: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Precio</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => onChange({ price: +e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Precio anterior</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => onChange({ oldPrice: +e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Stock inicial</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => onChange({ stock: +e.target.value })}
              className={inputClass}
              min={0}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Largo</label>
          <input
            type="text"
            value={form.length}
            onChange={(e) => onChange({ length: e.target.value })}
            className={inputClass}
            placeholder="ej: 45cm"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Peso</label>
          <input
            type="text"
            value={form.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
            className={inputClass}
            placeholder="ej: 12g"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Badge</label>
        <select
          value={form.badge}
          onChange={(e) => onChange({ badge: e.target.value })}
          className={inputClass}
        >
          {BADGES.map((b) => (
            <option key={b} value={b}>{b || "Ninguno"}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={form.waterproof}
            onChange={(v) => onChange({ waterproof: v })}
          />
          <span className="text-sm text-[var(--color-muted)]">Impermeable</span>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={form.featured}
            onChange={(v) => onChange({ featured: v })}
          />
          <span className="text-sm text-[var(--color-muted)]">Destacado</span>
        </div>
      </div>

      {form.hasVariants && variants !== undefined && onVariantsChange && (
        <div className="mt-4">
          <VariantMatrixInline
            variants={variants}
            basePrice={form.price}
            baseSku="DM"
            categoryName={form.category}
            onVariantsChange={onVariantsChange}
          />
        </div>
      )}
    </div>
  )
}

function VariantMatrixInline({
  variants,
  basePrice,
  baseSku,
  categoryName,
  onVariantsChange,
}: {
  variants: ProductVariant[]
  basePrice: number
  baseSku: string
  categoryName: string
  onVariantsChange: (variants: ProductVariant[]) => void
}): React.JSX.Element {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    PRODUCT_SIZE_MAP[categoryName] || []
  )
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const generateSku = (color: string | null, size: string | null) => {
    const parts = [baseSku]
    if (color) parts.push(color.slice(0, 3).toUpperCase())
    if (size) parts.push(size.replace(/\s+/g, "").toUpperCase())
    return parts.join("-")
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
            sku: generateSku(color, size),
            name: [color, size].filter(Boolean).join(" + ") || "Variante",
            color,
            colorHex: color ? (COLORS.find((c) => c.value === color)?.hex || null) : null,
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
    const kept = variants.filter(
      (v) => !newVariants.some((nv) => nv.color === v.color && nv.size === v.size)
    )
    onVariantsChange([...kept, ...newVariants])
  }

  const addSingle = () => {
    const v: ProductVariant = {
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
    onVariantsChange([...variants, v])
  }

  return (
    <div className="space-y-3 p-3 rounded-lg border border-[#333] bg-[#0d0d0d]">
      <span className="text-xs text-[var(--color-muted)]">
        Variantes: {variants.length}
      </span>

      <div className="flex gap-2">
        <select
          value=""
          onChange={(e) => {
            if (e.target.value && !selectedColors.includes(e.target.value)) {
              setSelectedColors((p) => [...p, e.target.value])
            }
          }}
          className="bg-[#0a0a0a] border border-[#333] rounded px-2 py-1 text-xs text-white"
        >
          <option value="">+ Color</option>
          {COLORS.filter((c) => !selectedColors.includes(c.value)).map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Talla"
          className="bg-[#0a0a0a] border border-[#333] rounded px-2 py-1 text-xs text-white w-20"
        />
        <button
          onClick={() => {
            if (newSize) {
              newSize.split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => {
                if (!selectedSizes.includes(s)) setSelectedSizes((p) => [...p, s])
              })
              setNewSize("")
            }
          }}
          className="px-2 py-1 text-xs rounded bg-[#1a1a1a] border border-[#333] text-white"
        >
          + Talla
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {selectedColors.map((c) => (
          <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#333] text-xs text-white">
            {COLORS.find((x) => x.value === c)?.label || c}
            <button onClick={() => setSelectedColors((p) => p.filter((x) => x !== c))} className="text-[var(--color-muted)] hover:text-red-400">x</button>
          </span>
        ))}
        {selectedSizes.map((s) => (
          <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#333] text-xs text-white">
            {s}
            <button onClick={() => setSelectedSizes((p) => p.filter((x) => x !== s))} className="text-[var(--color-muted)] hover:text-red-400">x</button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateAll}
          disabled={selectedColors.length === 0 && selectedSizes.length === 0}
          className="px-3 py-1.5 text-xs rounded bg-[var(--color-gold)] text-black font-medium disabled:opacity-40"
        >
          Generar combinaciones
        </button>
        <button
          onClick={addSingle}
          className="px-3 py-1.5 text-xs rounded border border-[#333] text-white"
        >
          + Variante
        </button>
      </div>
    </div>
  )
}

export default ProductForm
