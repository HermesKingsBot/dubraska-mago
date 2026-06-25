"use client"

import React from "react"
import { useAuth } from "@/context/OfficeAuthContext"

interface OfficeTopBarProps {
  title: string
  onToggleSidebar: () => void
}

function OfficeTopBar({ title, onToggleSidebar }: OfficeTopBarProps): React.JSX.Element {
  const { user, logout } = useAuth()
  const initial = user ? user.email.charAt(0).toUpperCase() : "A"

  return (
    <header className="h-14 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-xl text-[var(--color-muted)] hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold)] text-sm font-semibold">
          {initial}
        </div>
        <button
          onClick={logout}
          className="text-xs text-[var(--color-muted)] hover:text-red-400 transition-colors md:hidden"
        >
          Salir
        </button>
      </div>
    </header>
  )
}

export default OfficeTopBar
