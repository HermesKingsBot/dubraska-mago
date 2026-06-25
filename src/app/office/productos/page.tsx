"use client"

import React, { useState, useMemo } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import ConfirmDialog from "@/components/office/ConfirmDialog"
import ProductModal from "@/components/office/ProductModal"
import ProductList from "@/components/office/ProductList"
import { useProducts } from "@/hooks/useProducts"
import { CATEGORIES } from "@/types/product"
import type { OfficeProduct } from "@/types/office"

const STATUS_FILTERS = ["Todos", "Disponible", "Stock Bajo", "Agotado"]

function ProductosPage(): React.JSX.Element {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<OfficeProduct | null>(null)
  const [deleting, setDeleting] = useState<OfficeProduct | null>(null)

  const filtered = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, search, catFilter, statusFilter])

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
            Productos ({filtered.length})
          </h2>
          <button
            onClick={openNew}
            className="px-4 py-2 text-sm rounded-lg text-black font-medium"
            style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}
          >
            + Nuevo Producto
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="flex-1 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          />
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

        <ProductList
          products={filtered}
          onEdit={(p) => {
            setEditingProduct(p)
            setModalOpen(true)
          }}
          onDelete={setDeleting}
          onToggleVisible={(id, v) => updateProduct(id, { visible: v })}
        />

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
