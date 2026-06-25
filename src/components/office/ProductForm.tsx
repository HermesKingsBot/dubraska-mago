"use client"

import React from "react"
import { CATEGORIES, COLORS } from "@/types/product"
import ToggleSwitch from "./ToggleSwitch"

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
  }
  onChange: (updates: Partial<ProductFormProps["form"]>) => void
  onNameChange: (val: string) => void
}

const inputClass =
  "w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors"

function ProductForm({
  form,
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

      <div className="grid grid-cols-2 gap-3">
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
        <label className="block text-xs text-[var(--color-muted)] mb-1">Material</label>
        <input
          type="text"
          value={form.material}
          onChange={(e) => onChange({ material: e.target.value })}
          className={inputClass}
        />
      </div>

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
    </div>
  )
}

export default ProductForm
