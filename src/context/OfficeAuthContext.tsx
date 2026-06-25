"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { AuthUser } from "@/types/office"

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_EMAIL = "admin@dubraskamago.com"
const VALID_PASSWORD = "Dubraska2026!"
const STORAGE_KEY = "office_auth"

function OfficeAuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser
        setUser(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoaded(true)
  }, [])

  const login = (email: string, password: string): boolean => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const authUser: AuthUser = { email, name: "Admin", role: "admin" }
      setUser(authUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!loaded) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
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
