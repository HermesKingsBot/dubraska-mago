"use client"

import React, { useState, useMemo, useCallback } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import StatusBadge from "@/components/office/StatusBadge"
import OrderModal from "@/components/office/OrderModal"
import AdjustmentModal from "@/components/office/AdjustmentModal"
import ExportImportButtons from "@/components/office/ExportImportButtons"
import { useProducts } from "@/hooks/useProducts"
import type { OfficeProduct, StockOrder, StockAdjustment } from "@/types/office"

const MOVEMENT_TYPES = ["Todos", "STOCK_IN", "STOCK_OUT", "SET"] as const

function InventorySkeletonRow() {
  return (
    <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-white/10 rounded" />
        <div className="h-2.5 w-1/5 bg-white/10 rounded" />
      </div>
      <div className="h-8 w-12 bg-white/10 rounded" />
    </div>
  )
}

function exportCSV(products: OfficeProduct[]) {
  const headers = ["SKU", "Nombre", "Categoría", "Stock", "Estado"]
  const rows = products.map((p) => [
    p.sku,
    p.name,
    p.category,
    String(p.stock),
    p.stock === 0 ? "Agotado" : p.stock <= p.lowStockThreshold ? "Stock Bajo" : "Disponible",
  ])
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `inventario-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function InventarioPage(): React.JSX.Element {
  const { products, loaded, adjustments, adjustStock, addOrder, addAdjustment } = useProducts()
  const [orderProduct, setOrderProduct] = useState<OfficeProduct | null>(null)
  const [adjustProduct, setAdjustProduct] = useState<OfficeProduct | null>(null)
  const [search, setSearch] = useState("")
  const [movementFilter, setMovementFilter] = useState<string>("Todos")
  const [, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const totalUnits = products.reduce((s, p) => s + p.stock, 0)
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    })
  }, [products, search])

  const filteredAdjustments = useMemo(() => {
    if (movementFilter === "Todos") return adjustments
    return adjustments.filter((a) => {
      const type = a.newStock > a.previousStock ? "STOCK_IN" : a.newStock < a.previousStock ? "STOCK_OUT" : "SET"
      return type === movementFilter
    })
  }, [adjustments, movementFilter])

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
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Inventario
          </h2>
          <div className="flex items-center gap-4">
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
            <ExportImportButtons entity="inventory" onImportComplete={refresh} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-9 pr-3 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
            />
          </div>
          <select
            value={movementFilter}
            onChange={(e) => setMovementFilter(e.target.value)}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          >
            {MOVEMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "Todos" ? "Todos los movimientos" : t === "STOCK_IN" ? "Entradas" : t === "STOCK_OUT" ? "Salidas" : "Ajustes"}
              </option>
            ))}
          </select>
          <button
            onClick={() => exportCSV(filteredProducts)}
            className="px-4 py-2 rounded-lg border border-[#333] text-sm text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            CSV
          </button>
        </div>

        {!loaded ? (
          <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
            {Array.from({ length: 6 }).map((_, i) => (
              <InventorySkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
            {filteredProducts.map((p) => (
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
            {filteredProducts.length === 0 && (
              <div className="px-4 py-12 text-center">
                <p className="text-[var(--color-muted)] text-sm">No se encontraron productos.</p>
              </div>
            )}
          </div>
        )}

        {filteredAdjustments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Historial de Movimientos ({filteredAdjustments.length})
            </h3>
            <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
              {filteredAdjustments.slice(0, 20).map((a) => (
                <div key={a.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white">{a.productName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{a.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className={a.newStock > a.previousStock ? "text-green-400" : "text-red-400"}>
                      {a.previousStock} → {a.newStock}
                    </span>
                    <p className="text-xs text-[var(--color-muted)]">
                      {new Date(a.createdAt).toLocaleDateString("es-VE")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
