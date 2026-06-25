"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { AuthUser } from "@/types/office"

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function OfficeAuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const json = await res.json()
        if (json.success && json.data) {
          setUser(json.data as AuthUser)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const loginJson = await loginRes.json()
      if (!loginJson.success) {
        return { success: false, error: loginJson.error || "Login failed" }
      }
      const { token, user: userData } = loginJson.data
      const cookieRes = await fetch("/api/auth/set-cookie", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const cookieJson = await cookieRes.json()
      if (!cookieJson.success) {
        return { success: false, error: "Failed to set session cookie" }
      }
      setUser(userData as AuthUser)
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error"
      return { success: false, error: msg }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/clear-cookie", {
        method: "POST",
        credentials: "include",
      })
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch {
      // ignore
    }
    setUser(null)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within OfficeAuthProvider")
  return ctx
}

export { OfficeAuthProvider, useAuth }
export default OfficeAuthProvider
