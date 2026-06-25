"use client"

import React from "react"
import StatusBadge from "@/components/office/StatusBadge"
import ToggleSwitch from "@/components/office/ToggleSwitch"
import type { OfficeProduct } from "@/types/office"

interface ProductListProps {
  products: OfficeProduct[]
  onEdit: (product: OfficeProduct) => void
  onDelete: (product: OfficeProduct) => void
  onToggleVisible: (id: string, visible: boolean) => void
}

function ProductList({
  products,
  onEdit,
  onDelete,
  onToggleVisible,
}: ProductListProps): React.JSX.Element {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-[100px_1fr_100px_80px_80px_90px_50px_80px] gap-2 px-4 py-2 text-xs text-[var(--color-muted)] border-b border-[#222]">
        <span>SKU</span>
        <span>Nombre</span>
        <span>Categoría</span>
        <span>Precio</span>
        <span>Stock</span>
        <span>Estado</span>
        <span>Visible</span>
        <span>Acciones</span>
      </div>
      <div className="divide-y divide-[#222]">
        {products.map((p) => (
          <div key={p.id}>
            <div className="hidden md:grid grid-cols-[100px_1fr_100px_80px_80px_90px_50px_80px] gap-2 px-4 py-3 items-center text-sm">
              <span className="text-[var(--color-muted)] text-xs font-mono">{p.sku}</span>
              <span className="truncate">{p.name}</span>
              <span className="text-[var(--color-muted)] text-xs">{p.category}</span>
              <span>${p.price}</span>
              <span className={p.stock === 0 ? "text-red-400" : p.stock <= p.lowStockThreshold ? "text-yellow-400" : "text-green-400"}>
                {p.stock}
              </span>
              <StatusBadge stock={p.stock} threshold={p.lowStockThreshold} />
              <ToggleSwitch
                checked={p.visible}
                onChange={(v) => onToggleVisible(p.id, v)}
                size="sm"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(p)}
                  className="text-xs px-2 py-1 rounded border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="text-xs px-2 py-1 rounded border border-[#333] text-[var(--color-muted)] hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="md:hidden px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{p.sku} · {p.category}</p>
                </div>
                <StatusBadge stock={p.stock} threshold={p.lowStockThreshold} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>${p.price}</span>
                <span className={p.stock === 0 ? "text-red-400" : "text-[var(--color-muted)]"}>
                  Stock: {p.stock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <ToggleSwitch
                  checked={p.visible}
                  onChange={(v) => onToggleVisible(p.id, v)}
                  size="sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-xs px-3 py-1 rounded border border-[var(--color-gold)] text-[var(--color-gold)]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-xs px-3 py-1 rounded border border-red-500 text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
