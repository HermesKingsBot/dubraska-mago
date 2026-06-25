"use client"

import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/types/office"

const STORAGE_KEY = "office_categories"

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Collares", slug: "collares", description: "Collares y gargantillas de oro 18K", active: true, order: 1 },
  { id: "cat-2", name: "Pulseras", slug: "pulseras", description: "Pulseras, tobilleras y cadenas", active: true, order: 2 },
  { id: "cat-3", name: "Aretes", slug: "aretes", description: "Aretes, zarcillos y piercings", active: true, order: 3 },
  { id: "cat-4", name: "Sets", slug: "sets", description: "Sets completos collar + pulsera", active: true, order: 4 },
  { id: "cat-5", name: "Anillos", slug: "anillos", description: "Anillos y alianzas", active: false, order: 5 },
]

function loadCategories(): Category[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Category[]
    } catch {
      // fall through
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES))
  return DEFAULT_CATEGORIES
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCategories(loadCategories())
    setLoaded(true)
  }, [])

  const save = useCallback((next: Category[]) => {
    setCategories(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addCategory = useCallback(
    (cat: Category) => {
      save([...categories, cat])
    },
    [categories, save]
  )

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      save(categories.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    },
    [categories, save]
  )

  const deleteCategory = useCallback(
    (id: string) => {
      save(categories.filter((c) => c.id !== id))
    },
    [categories, save]
  )

  return { categories, loaded, addCategory, updateCategory, deleteCategory }
}
