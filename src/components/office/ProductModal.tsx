"use client"

import React, { useState, useEffect } from "react"
import type { OfficeProduct } from "@/types/office"
import ProductForm from "./ProductForm"

interface ProductModalProps {
  open: boolean
  product: OfficeProduct | null
  onSave: (data: OfficeProduct) => void
  onClose: () => void
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function generateId(slug: string): string {
  return `${slug}-${Date.now()}`
}

function ProductModal({
  open,
  product,
  onSave,
  onClose,
}: ProductModalProps): React.JSX.Element | null {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "collares",
    color: "dorado",
    price: 0,
    oldPrice: 0,
    material: "Acero inoxidable + Oro 18K",
    description: "",
    length: "",
    weight: "",
    waterproof: true,
    featured: false,
    badge: "",
    stock: 0,
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        category: product.category,
        color: product.color,
        price: product.price,
        oldPrice: product.oldPrice ?? 0,
        material: product.material,
        description: product.description,
        length: product.length ?? "",
        weight: product.weight ?? "",
        waterproof: true,
        featured: product.featured,
        badge: product.badge ?? "",
        stock: product.stock,
      })
    } else {
      setForm({
        name: "",
        slug: "",
        category: "collares",
        color: "dorado",
        price: 0,
        oldPrice: 0,
        material: "Acero inoxidable + Oro 18K",
        description: "",
        length: "",
        weight: "",
        waterproof: true,
        featured: false,
        badge: "",
        stock: 0,
      })
    }
  }, [product, open])

  if (!open) return null

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: product ? f.slug : generateSlug(val),
    }))
  }

  const handleFormChange = (updates: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...updates }))
  }

  const handleSave = () => {
    const id = product?.id ?? generateId(form.slug)
    const slug = form.slug || generateSlug(form.name)
    onSave({
      id,
      name: form.name,
      slug,
      description: form.description,
      price: form.price,
      oldPrice: form.oldPrice || null,
      category: form.category,
      color: form.color,
      badge: form.badge || null,
      image: product?.image ?? "/images/products/placeholder.jpg",
      material: form.material,
      length: form.length || undefined,
      weight: form.weight || undefined,
      inStock: form.stock > 0,
      featured: form.featured,
      stock: form.stock,
      lowStockThreshold: product?.lowStockThreshold ?? 5,
      sku: product?.sku ?? `DM-${form.category.slice(0, 3).toUpperCase()}-${form.color.slice(0, 3).toUpperCase()}`,
      visible: product?.visible ?? true,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-inter)" }}>
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h3>

        <ProductForm
          form={form}
          onChange={handleFormChange}
          onNameChange={handleNameChange}
        />

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
            {product ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
