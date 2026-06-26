"use client"

import React from "react"
import { COLORS } from "@/types/product"
import ToggleSwitch from "./ToggleSwitch"
import type { ProductVariant } from "@/types/product"

interface VariantFormProps {
  variant: ProductVariant
  onChange: (updates: Partial<ProductVariant>) => void
}

const inputClass =
  "w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors"

function VariantForm({
  variant,
  onChange,
}: VariantFormProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">SKU</label>
          <input
            type="text"
            value={variant.sku}
            onChange={(e) => onChange({ sku: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre</label>
          <input
            type="text"
            value={variant.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Color</label>
          <select
            value={variant.color || ""}
            onChange={(e) => {
              const color = e.target.value
              const preset = COLORS.find((c) => c.value === color)
              onChange({ color, colorHex: preset?.hex || variant.colorHex })
            }}
            className={inputClass}
          >
            <option value="">Sin color</option>
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Color Hex</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={variant.colorHex || "#888888"}
              onChange={(e) => onChange({ colorHex: e.target.value })}
              className="w-10 h-10 rounded border border-[#333] cursor-pointer"
            />
            <input
              type="text"
              value={variant.colorHex || ""}
              onChange={(e) => onChange({ colorHex: e.target.value })}
              className={inputClass}
              placeholder="#D4AF37"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Talla</label>
          <input
            type="text"
            value={variant.size || ""}
            onChange={(e) => onChange({ size: e.target.value || null })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Material</label>
          <input
            type="text"
            value={variant.material || ""}
            onChange={(e) => onChange({ material: e.target.value || null })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Precio (opcional)</label>
          <input
            type="number"
            value={variant.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value ? Number(e.target.value) : null })}
            className={inputClass}
            placeholder="Usar precio base"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Stock</label>
          <input
            type="number"
            value={variant.stock}
            onChange={(e) => onChange({ stock: +e.target.value })}
            className={inputClass}
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Imagen URL</label>
        <input
          type="text"
          value={variant.image || ""}
          onChange={(e) => onChange({ image: e.target.value || null })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <ToggleSwitch
          checked={variant.active}
          onChange={(v) => onChange({ active: v })}
        />
        <span className="text-sm text-[var(--color-muted)]">Activo</span>
      </div>
    </div>
  )
}

export default VariantForm
