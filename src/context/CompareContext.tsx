"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface CompareContextType {
  compareIds: string[]
  addToCompare: (productId: string) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
  compareCount: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)
const COMPARE_STORAGE_KEY = "dubraska-compare"
const MAX_COMPARE = 4

function getLocalCompare(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalCompare(ids: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids))
}

function CompareProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    setCompareIds(getLocalCompare())
  }, [])

  useEffect(() => {
    saveLocalCompare(compareIds)
  }, [compareIds])

  const addToCompare = useCallback((productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, productId]
    })
  }, [])

  const removeFromCompare = useCallback((productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareIds([])
  }, [])

  const isInCompare = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds]
  )

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareIds.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

function useCompare(): CompareContextType {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error("useCompare must be used within CompareProvider")
  return ctx
}

export { CompareProvider, useCompare }
export default CompareProvider
