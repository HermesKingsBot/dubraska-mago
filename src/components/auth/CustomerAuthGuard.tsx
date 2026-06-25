"use client"

import { useCustomerAuth } from "@/context/CustomerAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function CustomerAuthGuard({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated, isLoading } = useCustomerAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return <>{children}</>
}

export default CustomerAuthGuard
