"use client"

import { useState, useEffect, useCallback } from "react"
import type { OfficeProduct, StockOrder, StockAdjustment } from "@/types/office"
import productsData from "@/../data/products.json"

const PRODUCTS_KEY = "office_products"
const ORDERS_KEY = "office_stock_orders"
const ADJUSTMENTS_KEY = "office_stock_adjustments"

function mapToOffice(raw: Record<string, unknown>): OfficeProduct {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    price: raw.price as number,
    oldPrice: (raw.oldPrice as number) ?? null,
    category: raw.category as string,
    color: raw.color as string,
    badge: (raw.badge as string) ?? null,
    image: raw.image as string,
    material: raw.material as string,
    length: raw.length as string | undefined,
    diameter: raw.diameter as string | undefined,
    weight: raw.weight as string | undefined,
    pieces: raw.pieces as number | undefined,
    inStock: raw.inStock as boolean,
    featured: raw.featured as boolean,
    stock: (raw.stock as number) ?? 0,
    lowStockThreshold: (raw.lowStockThreshold as number) ?? 5,
    sku: (raw.sku as string) ?? "",
    visible: true,
  }
}

function loadProducts(): OfficeProduct[] {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as OfficeProduct[]
    } catch {
      // fall through
    }
  }
  const mapped = (productsData as unknown as Record<string, unknown>[]).map(
    mapToOffice
  )
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mapped))
  return mapped
}

function loadOrders(): StockOrder[] {
  const stored = localStorage.getItem(ORDERS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as StockOrder[]
    } catch {
      return []
    }
  }
  return []
}

function loadAdjustments(): StockAdjustment[] {
  const stored = localStorage.getItem(ADJUSTMENTS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as StockAdjustment[]
    } catch {
      return []
    }
  }
  return []
}

export function useProducts() {
  const [products, setProducts] = useState<OfficeProduct[]>([])
  const [orders, setOrders] = useState<StockOrder[]>([])
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProducts(loadProducts())
    setOrders(loadOrders())
    setAdjustments(loadAdjustments())
    setLoaded(true)
  }, [])

  const saveProducts = useCallback((next: OfficeProduct[]) => {
    setProducts(next)
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
  }, [])

  const addProduct = useCallback(
    (product: OfficeProduct) => {
      saveProducts([...products, product])
    },
    [products, saveProducts]
  )

  const updateProduct = useCallback(
    (id: string, updates: Partial<OfficeProduct>) => {
      saveProducts(
        products.map((p) => (p.id === id ? { ...p, ...updates } : p))
      )
    },
    [products, saveProducts]
  )

  const deleteProduct = useCallback(
    (id: string) => {
      saveProducts(products.filter((p) => p.id !== id))
    },
    [products, saveProducts]
  )

  const adjustStock = useCallback(
    (id: string, newStock: number) => {
      saveProducts(
        products.map((p) =>
          p.id === id
            ? {
                ...p,
                stock: newStock,
                inStock: newStock > 0,
              }
            : p
        )
      )
    },
    [products, saveProducts]
  )

  const addOrder = useCallback(
    (order: StockOrder) => {
      const next = [...orders, order]
      setOrders(next)
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
    },
    [orders]
  )

  const addAdjustment = useCallback(
    (adj: StockAdjustment) => {
      const next = [...adjustments, adj]
      setAdjustments(next)
      localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(next))
    },
    [adjustments]
  )

  return {
    products,
    orders,
    adjustments,
    loaded,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addOrder,
    addAdjustment,
  }
}
