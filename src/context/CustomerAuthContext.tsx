"use client"

import React, { createContext, useContext } from "react"
import { useAuth } from "@/context/AuthContext"

interface CustomerAuthContextType {
  user: {
    id: string
    name: string
    email: string
    role: string
    phone: string | null
  } | null
  isAuthenticated: boolean
  isCustomer: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

function CustomerAuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const auth = useAuth()

  return (
    <CustomerAuthContext.Provider value={auth}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

function useCustomerAuth(): CustomerAuthContextType {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider")
  return ctx
}

export { CustomerAuthProvider, useCustomerAuth }
export default CustomerAuthProvider
