"use client"

import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/types/office"
import type { Category as ApiCategory } from "@/types/index"

function mapCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    active: c.active,
    order: c.order,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { credentials: "include" })
      const json = await res.json()
      if (json.success) {
        const mapped = (json.data || []).map(mapCategory)
        setCategories(mapped)
      }
    } catch {
      setCategories([])
    }
  }, [])

  useEffect(() => {
    fetchCategories().then(() => setLoaded(true))
  }, [fetchCategories])

  const addCategory = useCallback(
    async (cat: Category) => {
      try {
        await fetch("/api/categories", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cat),
        })
        await fetchCategories()
      } catch {
        // ignore
      }
    },
    [fetchCategories]
  )

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      try {
        await fetch(`/api/categories/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        await fetchCategories()
      } catch {
        // ignore
      }
    },
    [fetchCategories]
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
        await fetchCategories()
      } catch {
        // ignore
      }
    },
    [fetchCategories]
  )

  return { categories, loaded, addCategory, updateCategory, deleteCategory }
}
