"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import type { Product } from "@/types"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

interface CartContextType {
  items: CartItem[]
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addItem: (productId: string, quantity?: number) => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "dubraska-cart"

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

function CartProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated } = useCustomerAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchServerCart = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/cart", { credentials: "include" })
      const json = await res.json()
      if (json.success && json.data) {
        setItems(json.data as CartItem[])
      }
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    async function init() {
      if (isAuthenticated) {
        const localCart = getLocalCart()
        if (localCart.length > 0) {
          for (const item of localCart) {
            try {
              await fetch("/api/customer/cart", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
              })
            } catch {
              // ignore individual merge failures
            }
          }
          localStorage.removeItem(CART_STORAGE_KEY)
        }
        await fetchServerCart()
      } else {
        setItems(getLocalCart())
      }
      setIsLoading(false)
    }
    init()
  }, [isAuthenticated, fetchServerCart])

  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(items)
    }
  }, [items, isAuthenticated])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const addItem = async (productId: string, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        const res = await fetch("/api/customer/cart", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        })
        const json = await res.json()
        if (json.success && json.data) {
          await fetchServerCart()
        }
      } catch {
        // ignore
      }
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId)
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
          )
        }
        const newItem: CartItem = {
          id: `local-${Date.now()}`,
          productId,
          quantity,
          product: { id: productId } as Product,
        }
        return [...prev, newItem]
      })
    }
  }

  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        await fetch(`/api/customer/cart/${productId}`, {
          method: "DELETE",
          credentials: "include",
        })
        await fetchServerCart()
      } catch {
        // ignore
      }
    } else {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        await fetch(`/api/customer/cart/${productId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        })
        await fetchServerCart()
      } catch {
        // ignore
      }
    } else {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.productId !== productId))
      } else {
        setItems((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
        )
      }
    }
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await fetch("/api/customer/cart", {
          method: "DELETE",
          credentials: "include",
        })
      } catch {
        // ignore
      }
    }
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return (
    <CartContext.Provider
      value={{ items, cartItems: items, cartCount, cartTotal, addItem, addToCart: addItem, removeItem, removeFromCart: removeItem, updateQuantity, clearCart, isLoading }}
    >
      {children}
    </CartContext.Provider>
  )
}

function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export { CartProvider, useCart }
export default CartProvider
