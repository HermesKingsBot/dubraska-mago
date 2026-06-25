"use client"

import React, { useState } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import StatusBadge from "@/components/office/StatusBadge"
import OrderModal from "@/components/office/OrderModal"
import AdjustmentModal from "@/components/office/AdjustmentModal"
import { useProducts } from "@/hooks/useProducts"
import type { OfficeProduct, StockOrder, StockAdjustment } from "@/types/office"

function InventarioPage(): React.JSX.Element {
  const { products, adjustStock, addOrder, addAdjustment } = useProducts()
  const [orderProduct, setOrderProduct] = useState<OfficeProduct | null>(null)
  const [adjustProduct, setAdjustProduct] = useState<OfficeProduct | null>(null)

  const totalUnits = products.reduce((s, p) => s + p.stock, 0)
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const quickAdjust = (id: string, delta: number) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    const next = Math.max(0, p.stock + delta)
    adjustStock(id, next)
  }

  const handleOrderSave = (order: StockOrder) => {
    addOrder(order)
    quickAdjust(order.productId, order.quantity)
    setOrderProduct(null)
  }

  const handleAdjustSave = (adj: StockAdjustment, newStock: number) => {
    addAdjustment(adj)
    adjustStock(adj.productId, newStock)
    setAdjustProduct(null)
  }

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
            Inventario
          </h2>
          <div className="flex gap-4 text-sm">
            <span className="text-[var(--color-muted)]">
              Total: <span className="text-white font-medium">{totalUnits}</span> unidades
            </span>
            <span className="text-yellow-400">
              Stock bajo: {lowStockCount}
            </span>
            <span className="text-red-400">
              Agotados: {outOfStockCount}
            </span>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
          {products.map((p) => (
            <div key={p.id} className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{p.sku}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="text-2xl font-bold min-w-[48px] text-center"
                  style={{
                    color:
                      p.stock === 0
                        ? "#ef4444"
                        : p.stock <= p.lowStockThreshold
                        ? "#eab308"
                        : "#22c55e",
                  }}
                >
                  {p.stock}
                </span>
                <StatusBadge stock={p.stock} threshold={p.lowStockThreshold} />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => quickAdjust(p.id, -5)}
                  className="w-7 h-7 rounded border border-[#333] text-xs text-[var(--color-muted)] hover:border-red-500 hover:text-red-400 transition-colors flex items-center justify-center"
                >
                  -5
                </button>
                <button
                  onClick={() => quickAdjust(p.id, -1)}
                  className="w-7 h-7 rounded border border-[#333] text-xs text-[var(--color-muted)] hover:border-red-500 hover:text-red-400 transition-colors flex items-center justify-center"
                >
                  -1
                </button>
                <button
                  onClick={() => quickAdjust(p.id, 1)}
                  className="w-7 h-7 rounded border border-[#333] text-xs text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center justify-center"
                >
                  +1
                </button>
                <button
                  onClick={() => quickAdjust(p.id, 5)}
                  className="w-7 h-7 rounded border border-[#333] text-xs text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center justify-center"
                >
                  +5
                </button>
                <button
                  onClick={() => quickAdjust(p.id, 10)}
                  className="w-7 h-7 rounded border border-[#333] text-xs text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center justify-center"
                >
                  +10
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAdjustProduct(p)}
                  className="text-xs px-3 py-1.5 rounded border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                >
                  Ajuste Manual
                </button>
                <button
                  onClick={() => setOrderProduct(p)}
                  className="text-xs px-3 py-1.5 rounded border border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors"
                >
                  Hacer Pedido
                </button>
              </div>
            </div>
          ))}
        </div>

        <OrderModal
          open={!!orderProduct}
          product={orderProduct}
          onSave={handleOrderSave}
          onClose={() => setOrderProduct(null)}
        />

        <AdjustmentModal
          open={!!adjustProduct}
          product={adjustProduct}
          onSave={handleAdjustSave}
          onClose={() => setAdjustProduct(null)}
        />
      </div>
    </AuthGuard>
  )
}

export default InventarioPage
