"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useCustomerAuth } from "@/context/CustomerAuthContext"

const MENU_ITEMS = [
  { label: "Mi Cuenta", href: "/cuenta" },
  { label: "Mis Pedidos", href: "/cuenta/pedidos" },
  { label: "Mi Wishlist", href: "/cuenta/wishlist" },
]

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useCustomerAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="hidden sm:inline-flex rounded-full px-5 py-2 text-sm font-medium border border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all duration-300"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Iniciar Sesión
      </Link>
    )
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "U"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)] text-sm font-semibold hover:bg-[var(--color-gold)]/25 transition-colors duration-300"
        style={{ fontFamily: "var(--font-dm-sans)" }}
        aria-label="Menú de usuario"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[var(--color-dark-accent)] border border-white/10 shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm text-white truncate font-medium">{user?.name}</p>
            <p className="text-xs text-[var(--color-muted)] truncate">{user?.email}</p>
          </div>
          <nav className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/5 py-1">
            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors duration-200"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
