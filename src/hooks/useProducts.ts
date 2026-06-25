"use client"

import { useState, useEffect, useCallback } from "react"
import type { OfficeProduct, StockOrder, StockAdjustment } from "@/types/office"

export function useProducts() {
  const [products, setProducts] = useState<OfficeProduct[]>([])
  const [orders, setOrders] = useState<StockOrder[]>([])
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)

  const fetchProducts = useCallback(async (includeDeleted = false) => {
    try {
      const res = await fetch(`/api/products?limit=200${includeDeleted ? "&includeDeleted=true" : ""}`, { credentials: "include" })
      const json = await res.json()
      if (json.success) {
        const items = json.data.items || []
        const mapped = items.map((p: Record<string, unknown>) => {
          const cat = p.category as Record<string, unknown> | undefined
          return {
            id: String(p.id),
            name: String(p.name),
            slug: String(p.slug),
            description: String(p.description),
            price: Number(p.price),
            oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
            category: cat?.slug ? String(cat.slug) : String(p.categoryId || ""),
            color: String(p.color),
            badge: p.badge ? String(p.badge) : null,
            image: String(p.image),
            material: String(p.material),
            length: p.length ? String(p.length) : undefined,
            diameter: p.diameter ? String(p.diameter) : undefined,
            weight: p.weight ? String(p.weight) : undefined,
            inStock: Boolean(p.inStock),
            featured: Boolean(p.featured),
            stock: Number(p.stock),
            lowStockThreshold: Number(p.lowStock) || 5,
            sku: String(p.sku),
            visible: true,
          } as OfficeProduct
        })
        setProducts(mapped)
      }
    } catch {
      setProducts([])
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { credentials: "include" })
      const json = await res.json()
      if (json.success) {
        setOrders(json.data || [])
      }
    } catch {
      setOrders([])
    }
  }, [])

  const fetchAdjustments = useCallback(async () => {
    try {
      const res = await fetch("/api/inventory", { credentials: "include" })
      const json = await res.json()
      if (json.success) {
        const items = json.data || []
        setAdjustments(
          items.map((m: Record<string, unknown>) => ({
            id: m.id as string,
            productId: m.productId as string,
            productName: (m.product as Record<string, unknown>)?.name as string || "",
            previousStock: m.previousStock as number,
            newStock: m.newStock as number,
            reason: m.reason as string,
            createdAt: m.createdAt as string,
          }))
        )
      }
    } catch {
      setAdjustments([])
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchProducts(showDeleted), fetchOrders(), fetchAdjustments()]).then(
      () => setLoaded(true)
    )
  }, [fetchProducts, fetchOrders, fetchAdjustments, showDeleted])

  const addProduct = useCallback(
    async (product: OfficeProduct) => {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            lowStock: product.lowStockThreshold,
            gallery: [],
          }),
        })
        const json = await res.json()
        if (json.success) {
          await fetchProducts()
        }
      } catch {
        // ignore
      }
    },
    [fetchProducts]
  )

  const updateProduct = useCallback(
    async (id: string, updates: Partial<OfficeProduct>) => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        const json = await res.json()
        if (json.success) {
          await fetchProducts()
        }
      } catch {
        // ignore
      }
    },
    [fetchProducts]
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
        await fetchProducts()
      } catch {
        // ignore
      }
    },
    [fetchProducts]
  )

  const adjustStock = useCallback(
    async (id: string, newStock: number) => {
      try {
        const product = products.find((p) => p.id === id)
        if (!product) return
        const quantity = Math.abs(newStock - product.stock)
        const type = newStock > product.stock ? "STOCK_IN" : "STOCK_OUT"
        await fetch("/api/inventory/adjust", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            type,
            quantity: quantity || 1,
            reason: "Manual adjustment",
          }),
        })
        await fetchProducts()
        await fetchAdjustments()
      } catch {
        // ignore
      }
    },
    [products, fetchProducts, fetchAdjustments]
  )

  const addOrder = useCallback(
    async (order: StockOrder) => {
      try {
        await fetch("/api/orders", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: order.supplier,
            customerEmail: "office@dubraska.com",
            notes: order.notes,
            items: [{ productId: order.productId, quantity: order.quantity }],
          }),
        })
        await fetchOrders()
        await fetchProducts()
      } catch {
        // ignore
      }
    },
    [fetchOrders, fetchProducts]
  )

  const addAdjustment = useCallback(
    async (adj: StockAdjustment) => {
      try {
        const type = adj.newStock > adj.previousStock ? "STOCK_IN" : "STOCK_OUT"
        const quantity = Math.abs(adj.newStock - adj.previousStock)
        await fetch("/api/inventory/adjust", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: adj.productId,
            type,
            quantity: quantity || 1,
            reason: adj.reason,
          }),
        })
        await fetchAdjustments()
        await fetchProducts()
      } catch {
        // ignore
      }
    },
    [fetchAdjustments, fetchProducts]
  )

  return {
    products,
    orders,
    adjustments,
    loaded,
    showDeleted,
    setShowDeleted,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addOrder,
    addAdjustment,
  }
}
