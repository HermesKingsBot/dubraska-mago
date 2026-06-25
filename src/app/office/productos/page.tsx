"use client"

import React, { useState, useMemo, useCallback } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import ConfirmDialog from "@/components/office/ConfirmDialog"
import ProductModal from "@/components/office/ProductModal"
import ProductList from "@/components/office/ProductList"
import ToggleSwitch from "@/components/office/ToggleSwitch"
import RestoreButton from "@/components/office/RestoreButton"
import ExportImportButtons from "@/components/office/ExportImportButtons"
import { useProducts } from "@/hooks/useProducts"
import { CATEGORIES } from "@/types/product"
import type { OfficeProduct } from "@/types/office"

const STATUS_FILTERS = ["Todos", "Disponible", "Stock Bajo", "Agotado"]

function ProductSkeletonRow() {
  return (
    <div className="px-4 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-white/10 rounded" />
        <div className="h-2.5 w-1/5 bg-white/10 rounded" />
      </div>
      <div className="h-4 w-16 bg-white/10 rounded" />
      <div className="h-4 w-8 bg-white/10 rounded" />
    </div>
  )
}

function ProductosPage(): React.JSX.Element {
  const { products, loaded, showDeleted, setShowDeleted, addProduct, updateProduct, deleteProduct } = useProducts()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<OfficeProduct | null>(null)
  const [deleting, setDeleting] = useState<OfficeProduct | null>(null)
  const [, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const isDeleted = !!(p as unknown as { deletedAt: string | null }).deletedAt
      if (showDeleted && !isDeleted) return true
      if (!showDeleted && isDeleted) return false
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = !catFilter || p.category === catFilter
      const matchStatus =
        statusFilter === "Todos" ||
        (statusFilter === "Disponible" && p.stock > p.lowStockThreshold) ||
        (statusFilter === "Stock Bajo" && p.stock > 0 && p.stock <= p.lowStockThreshold) ||
        (statusFilter === "Agotado" && p.stock === 0)
      return matchSearch && matchCat && matchStatus
    })
  }, [products, search, catFilter, statusFilter, showDeleted])

  const handleSave = (data: OfficeProduct) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data)
    } else {
      addProduct(data)
    }
    setModalOpen(false)
    setEditingProduct(null)
  }

  const openNew = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
            Productos ({loaded ? filtered.length : "..."})
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ToggleSwitch checked={showDeleted} onChange={setShowDeleted} size="sm" />
              <span className="text-xs text-[var(--color-muted)]">Mostrar eliminados</span>
            </div>
            <ExportImportButtons entity="products" onImportComplete={refresh} />
            <button
              onClick={openNew}
              className="px-4 py-2 text-sm rounded-lg text-black font-medium"
              style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}
            >
              + Nuevo Producto
            </button>
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
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-9 pr-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {!loaded ? (
          <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <ProductList
            products={filtered}
            onEdit={(p) => {
              setEditingProduct(p)
              setModalOpen(true)
            }}
            onDelete={setDeleting}
            onToggleVisible={(id, v) => updateProduct(id, { visible: v })}
            onRestore={async (id) => {
              const res = await fetch(`/api/trash/Product/${id}`, { method: "POST", credentials: "include" })
              const json = await res.json()
              return json.success
            }}
            showDeleted={showDeleted}
          />
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center">
            <svg className="mx-auto mb-4 text-[var(--color-muted)]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <p className="text-[var(--color-muted)] text-sm" style={{ fontFamily: "var(--font-inter)" }}>
              No se encontraron productos con esos filtros.
            </p>
          </div>
        )}

        <ProductModal
          open={modalOpen}
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false)
            setEditingProduct(null)
          }}
        />

        <ConfirmDialog
          open={!!deleting}
          title="Eliminar producto"
          message={`¿Eliminar "${deleting?.name}"? Esta acción no se puede deshacer.`}
          onConfirm={() => {
            if (deleting) deleteProduct(deleting.id)
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      </div>
    </AuthGuard>
  )
}

export default ProductosPage
