"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import type { Product } from "@/types"

interface WishlistItem {
  id: string
  productId: string
  product: Product
}

interface WishlistContextType {
  items: WishlistItem[]
  wishlistItems: WishlistItem[]
  wishlistCount: number
  toggleWishlist: (productId: string) => Promise<void>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = "dubraska-wishlist"

function getLocalWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
}

function WishlistProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated } = useCustomerAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchServerWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/wishlist", { credentials: "include" })
      const json = await res.json()
      if (json.success && json.data) {
        setItems(json.data as WishlistItem[])
      }
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    async function init() {
      if (isAuthenticated) {
        const localWishlist = getLocalWishlist()
        if (localWishlist.length > 0) {
          for (const item of localWishlist) {
            try {
              await fetch("/api/customer/wishlist", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item.productId }),
              })
            } catch {
              // ignore individual merge failures
            }
          }
          localStorage.removeItem(WISHLIST_STORAGE_KEY)
        }
        await fetchServerWishlist()
      } else {
        setItems(getLocalWishlist())
      }
      setIsLoading(false)
    }
    init()
  }, [isAuthenticated, fetchServerWishlist])

  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalWishlist(items)
    }
  }, [items, isAuthenticated])

  const wishlistCount = items.length

  const toggleWishlist = async (productId: string) => {
    if (isAuthenticated) {
      const existing = items.find((i) => i.productId === productId)
      try {
        if (existing) {
          await fetch(`/api/customer/wishlist/${productId}`, {
            method: "DELETE",
            credentials: "include",
          })
          await fetchServerWishlist()
        } else {
          await fetch("/api/customer/wishlist", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })
          await fetchServerWishlist()
        }
      } catch {
        // ignore
      }
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId)
        if (existing) {
          return prev.filter((i) => i.productId !== productId)
        }
        const newItem: WishlistItem = {
          id: `local-${Date.now()}`,
          productId,
          product: { id: productId } as Product,
        }
        return [...prev, newItem]
      })
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.productId === productId)
  }

  return (
    <WishlistContext.Provider
      value={{ items, wishlistItems: items, wishlistCount, toggleWishlist, addToWishlist: toggleWishlist, removeFromWishlist: toggleWishlist, isInWishlist, isLoading }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}

export { WishlistProvider, useWishlist }
export default WishlistProvider
