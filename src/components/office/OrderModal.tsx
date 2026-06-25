"use client"

import React, { useState } from "react"
import type { OfficeProduct, StockOrder, OrderSupplier } from "@/types/office"

const SUPPLIERS: OrderSupplier[] = ["Proveedor", "Fabricación", "Reposición"]

interface OrderModalProps {
  open: boolean
  product: OfficeProduct | null
  onSave: (order: StockOrder) => void
  onClose: () => void
}

function OrderModal({
  open,
  product,
  onSave,
  onClose,
}: OrderModalProps): React.JSX.Element | null {
  const [supplier, setSupplier] = useState<OrderSupplier>("Proveedor")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [expectedDate, setExpectedDate] = useState("")

  if (!open || !product) return null

  const handleSave = () => {
    onSave({
      id: `order-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      supplier,
      quantity,
      notes,
      expectedDate,
      createdAt: new Date().toISOString(),
    })
    setSupplier("Proveedor")
    setQuantity(1)
    setNotes("")
    setExpectedDate("")
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-inter)" }}>
          Hacer Pedido
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
            <label className="block text-xs text-[var(--color-muted)] mb-1">Solicitante</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value as OrderSupplier)}
              className={inputClass}
            >
              {SUPPLIERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Cantidad</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
              min={1}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Fecha esperada</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className={inputClass}
            />
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
            Registrar Pedido
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
