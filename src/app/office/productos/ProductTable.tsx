"use client"

import React from "react"
import { useProducts } from "@/hooks/useProducts"

function ProductTable(): React.JSX.Element {
  const { products } = useProducts()

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-[100px_1fr_100px_80px_80px_90px] gap-2 px-4 py-2 text-xs text-[var(--color-muted)] border-b border-[#222]">
        <span>SKU</span>
        <span>Nombre</span>
        <span>Categoría</span>
        <span>Precio</span>
        <span>Stock</span>
        <span>Estado</span>
      </div>
      <div className="divide-y divide-[#222]">
        {products.map((p) => (
          <div key={p.id} className="hidden md:grid grid-cols-[100px_1fr_100px_80px_80px_90px] gap-2 px-4 py-3 items-center text-sm">
            <span className="text-[var(--color-muted)] text-xs font-mono">{p.sku}</span>
            <span className="truncate">{p.name}</span>
            <span className="text-[var(--color-muted)] text-xs">{p.category}</span>
            <span>${p.price}</span>
            <span className={p.stock === 0 ? "text-red-400" : p.stock <= p.lowStockThreshold ? "text-yellow-400" : "text-green-400"}>
              {p.stock}
            </span>
            <span className="text-xs">
              {p.stock === 0 ? "Agotado" : p.stock <= p.lowStockThreshold ? "Stock Bajo" : "Disponible"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductTable
