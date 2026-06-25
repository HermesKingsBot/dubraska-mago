"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/OfficeAuthContext"

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/office/dashboard" },
  { label: "Productos", icon: "💎", href: "/office/productos" },
  { label: "Inventario", icon: "📦", href: "/office/inventario" },
  { label: "Categorías", icon: "🏷️", href: "/office/categorias", disabled: true },
  { label: "Testimonios", icon: "⭐", href: "/office/testimonios", disabled: true },
]

function OfficeSidebar(): React.JSX.Element {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-[#222] flex flex-col z-40 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-[#111] border border-[#333] rounded-full w-6 h-6 flex items-center justify-center text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors md:flex hidden"
        aria-label="Toggle sidebar"
      >
        {collapsed ? "›" : "‹"}
      </button>

      <div className="p-4 border-b border-[#222]">
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
          <p className="text-[var(--color-gold)] text-lg text-center font-bold">
            DM
          </p>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors mx-2 rounded ${
                item.disabled
                  ? "opacity-30 cursor-not-allowed"
                  : active
                  ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-l-2 border-[var(--color-gold)]"
                  : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
              }`}
              onClick={(e) => {
                if (item.disabled) e.preventDefault()
              }}
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.disabled && (
                <span className="ml-auto text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[var(--color-muted)]">
                  Próximamente
                </span>
              )}
            </Link>
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
    </aside>
  )
}

export default OfficeSidebar
