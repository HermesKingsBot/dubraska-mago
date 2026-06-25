"use client"

import { useAuth } from "@/context/OfficeAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function AuthGuard({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/office")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return <>{children}</>
}

export default AuthGuard
