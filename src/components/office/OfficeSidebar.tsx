"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/OfficeAuthContext"

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/office/dashboard" },
  { label: "Productos", icon: "💎", href: "/office/productos" },
  { label: "Inventario", icon: "📦", href: "/office/inventario" },
  { label: "Categorías", icon: "🏷️", href: "/office/categorias" },
  { label: "Testimonios", icon: "⭐", href: "/office/testimonios" },
]

interface OfficeSidebarProps {
  open: boolean
  onClose: () => void
}

function OfficeSidebar({ open, onClose }: OfficeSidebarProps): React.JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleNav = (href: string) => {
    router.push(href)
    onClose()
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-[#222]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <p className="text-[var(--color-gold)] font-semibold text-sm tracking-wider">
                DUBRASKA MAGO
              </p>
              <p className="text-[10px] text-[var(--color-muted)] tracking-widest">
                Admin Panel
              </p>
            </div>
          )}
          {collapsed && (
            <p className="text-[var(--color-gold)] text-lg text-center font-bold w-full">
              DM
            </p>
          )}
          <button
            onClick={onClose}
            className="md:hidden text-[var(--color-muted)] hover:text-white text-lg ml-2"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-[#111] border border-[#333] rounded-full w-6 h-6 items-center justify-center text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors hidden md:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors mx-2 rounded w-[calc(100%-1rem)] text-left ${
                active
                  ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-l-2 border-[var(--color-gold)]"
                  : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#222]">
        {!collapsed && user && (
          <p className="text-xs text-[var(--color-muted)] mb-2 truncate">
            {user.email}
          </p>
        )}
        <button
          onClick={logout}
          className="w-full text-xs py-2 rounded border border-[#333] text-[var(--color-muted)] hover:border-red-500 hover:text-red-400 transition-colors"
        >
          {collapsed ? "⏻" : "Cerrar sesión"}
        </button>
      </div>
    </>
  )

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-[#222] flex flex-col z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default OfficeSidebar
