"use client"

import { useAuth } from "@/context/OfficeAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function AuthGuard({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/office")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[var(--color-bg)]" />
  }

  return <>{children}</>
}

export default AuthGuard
