"use client"

import React, { useState } from "react"
import type { OfficeProduct, StockAdjustment, AdjustmentReason } from "@/types/office"

const REASONS: AdjustmentReason[] = [
  "Conteo físico",
  "Ajuste sistema",
  "Devolución",
  "Otro",
]

interface AdjustmentModalProps {
  open: boolean
  product: OfficeProduct | null
  onSave: (adj: StockAdjustment, newStock: number) => void
  onClose: () => void
}

function AdjustmentModal({
  open,
  product,
  onSave,
  onClose,
}: AdjustmentModalProps): React.JSX.Element | null {
  const [newStock, setNewStock] = useState(0)
  const [reason, setReason] = useState<AdjustmentReason>("Conteo físico")

  if (!open || !product) return null

  const handleSave = () => {
    onSave(
      {
        id: `adj-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        previousStock: product.stock,
        newStock,
        reason,
        createdAt: new Date().toISOString(),
      },
      newStock
    )
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Ajuste Manual
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Producto</label>
            <input
              type="text"
              value={product.name}
              readOnly
              className={`${inputClass} opacity-60`}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Stock actual</label>
            <input
              type="text"
              value={product.stock}
              readOnly
              className={`${inputClass} opacity-60`}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Nuevo stock</label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(+e.target.value)}
              min={0}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Razón</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as AdjustmentReason)}
              className={inputClass}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[#222]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-[var(--color-gold)] text-black font-medium hover:brightness-110 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdjustmentModal
