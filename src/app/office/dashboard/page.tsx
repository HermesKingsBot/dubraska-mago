"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/office/AuthGuard"
import StatCard from "@/components/office/StatCard"
import { useProducts } from "@/hooks/useProducts"

interface DashboardStats {
  totalOrders: number
  recentOrders: { id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }[]
}

function DashboardPage(): React.JSX.Element {
  const { products, loaded } = useProducts()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({ totalOrders: 0, recentOrders: [] })
  const [statsLoaded, setStatsLoaded] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/orders", { credentials: "include" })
        const json = await res.json()
        if (json.success) {
          const orders = json.data || []
          setStats({
            totalOrders: orders.length,
            recentOrders: orders.slice(0, 5),
          })
        }
      } catch {
        // ignore
      } finally {
        setStatsLoaded(true)
      }
    }
    fetchStats()
  }, [])

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    CONFIRMED: "text-blue-400",
    PROCESSING: "text-purple-400",
    SHIPPED: "text-cyan-400",
    DELIVERED: "text-green-400",
    CANCELLED: "text-red-400",
  }

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            }
            value={stats.totalOrders}
            label="Total Pedidos"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/office/productos")}
                className="w-full text-left px-4 py-3 rounded-lg border border-[var(--color-gold)]/30 text-sm hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-[var(--color-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span>Gestionar Productos</span>
              </button>
              <button
                onClick={() => router.push("/office/inventario")}
                className="w-full text-left px-4 py-3 rounded-lg border border-[#333] text-sm hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0V6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v.75m16.5 0v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V7.5" />
                </svg>
                <span>Ajuste de Inventario</span>
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-lg border border-[#333] text-sm hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/10 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349" />
                </svg>
                <span>Ver Tienda</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Pedidos Recientes
            </h2>
            {!statsLoaded ? (
              <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between animate-pulse">
                    <div className="space-y-1.5">
                      <div className="h-3 w-32 bg-white/10 rounded" />
                      <div className="h-2.5 w-20 bg-white/10 rounded" />
                    </div>
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : stats.recentOrders.length > 0 ? (
              <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{order.customerName}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        #{order.orderNumber} — ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${statusColors[order.status] || "text-[var(--color-muted)]"}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
                <p className="text-[var(--color-muted)] text-sm">No hay pedidos registrados aún.</p>
              </div>
            )}

            {lowStock > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-6 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Alertas de Stock Bajo
                </h2>
                <div className="bg-[#111] border border-[#222] rounded-xl divide-y divide-[#222]">
                  {products
                    .filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold)
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">{p.name}</p>
                          <p className="text-xs text-[var(--color-muted)]">{p.sku}</p>
                        </div>
                        <span className="text-sm font-bold text-yellow-400">{p.stock} uds</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default DashboardPage
