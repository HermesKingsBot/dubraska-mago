"use client"

import React from "react"
import { useAuth } from "@/context/OfficeAuthContext"
import OfficeSidebar from "./OfficeSidebar"
import OfficeTopBar from "./OfficeTopBar"
import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/office/dashboard": "Dashboard",
  "/office/productos": "Productos",
  "/office/inventario": "Inventario",
  "/office/categorias": "Categorías",
  "/office/testimonios": "Testimonios",
}

function OfficeLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "Admin"

  if (!isAuthenticated || pathname === "/office") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <OfficeSidebar />
      <div className="flex-1 ml-60 transition-all duration-300 md:ml-60">
        <OfficeTopBar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default OfficeLayout
