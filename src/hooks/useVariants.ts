"use client"

import { useState, useEffect, useCallback } from "react"
import type { ProductVariant } from "@/types/product"

export function useVariants(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) {
      setVariants([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/products/${productId}/variants`, { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setVariants(j.data)
      })
      .catch(() => setVariants([]))
      .finally(() => setLoading(false))
  }, [productId])

  const createVariant = useCallback(
    async (data: Partial<ProductVariant>) => {
      const res = await fetch(`/api/products/${productId}/variants`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) setVariants((prev) => [...prev, json.data])
      return json
    },
    [productId]
  )

  const bulkUpdate = useCallback(
    async (newVariants: Partial<ProductVariant>[], replaceExisting = false) => {
      const res = await fetch(`/api/products/${productId}/variants/bulk`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variants: newVariants, replaceExisting }),
      })
      const json = await res.json()
      if (json.success) setVariants(json.data.variants)
      return json
    },
    [productId]
  )

  const deleteVariant = useCallback(
    async (variantId: string) => {
      await fetch(`/api/products/${productId}/variants/${variantId}`, {
        method: "DELETE",
        credentials: "include",
      })
      setVariants((prev) => prev.filter((v) => v.id !== variantId))
    },
    [productId]
  )

  const updateVariant = useCallback(
    async (variantId: string, data: Partial<ProductVariant>) => {
      const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? json.data : v))
        )
      }
      return json
    },
    [productId]
  )

  return {
    variants,
    loading,
    createVariant,
    bulkUpdate,
    deleteVariant,
    updateVariant,
    setVariants,
  }
}
