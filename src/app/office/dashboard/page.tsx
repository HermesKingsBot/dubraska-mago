"use client"

import React from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/office/AuthGuard"
import StatCard from "@/components/office/StatCard"
import { useProducts } from "@/hooks/useProducts"

const ACTIVITIES = [
  { text: "Producto creado: Collar Cadena Dorado", time: "Hace 2 horas" },
  { text: "Stock actualizado: Pulsera Eslabones (+10)", time: "Hace 5 horas" },
  { text: "Pedido registrado: Aretes Perla Plateada ×5", time: "Ayer" },
  { text: "Ajuste de inventario: Set Completo Oro", time: "Hace 2 días" },
  { text: "Producto creado: Collar Choker Negro", time: "Hace 3 días" },
]

function DashboardPage(): React.JSX.Element {
  const { products } = useProducts()
  const router = useRouter()

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            value={totalProducts}
            label="Total Productos"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0V6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v.75m16.5 0v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V7.5" />
              </svg>
            }
            value={totalStock}
            label="Stock Disponible"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
            value={lowStock}
            label="Stock Bajo"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            }
            value={outOfStock}
            label="Agotados"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/office/productos")}
                className="w-full text-left px-4 py-3 rounded-lg border border-[var(--color-gold)]/30 text-sm hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <span className="text-lg">💎</span>
                <span>Gestionar Productos</span>
              </button>
              <button
                onClick={() => router.push("/office/inventario")}
                className="w-full text-left px-4 py-3 rounded-lg border border-[#333] text-sm hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <span className="text-lg">📦</span>
                <span>Ajuste de Inventario</span>
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-lg border border-[#333] text-sm hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <span className="text-lg">🏪</span>
                <span>Ver Tienda</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Actividad Reciente
            </h2>
            <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-white">{a.text}</p>
                  <span className="text-xs text-[var(--color-muted)] whitespace-nowrap ml-4">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default DashboardPage
