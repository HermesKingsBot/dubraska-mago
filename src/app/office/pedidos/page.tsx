"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/office/AuthGuard"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
  payment?: { status: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  PAYMENT_PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  PAYMENT_REVIEW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PAYMENT_REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PROCESSING: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  SHIPPED: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  DELIVERED: "text-green-400 bg-green-500/10 border-green-500/20",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/20",
}

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  SUBMITTED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  APPROVED: "text-green-400 bg-green-500/10 border-green-500/20",
  REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAYMENT_PENDING: "Pago Pendiente",
  PAYMENT_REVIEW: "En Revisión",
  PAYMENT_REJECTED: "Pago Rechazado",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
}

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  SUBMITTED: "Enviado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
}

function PedidosPage(): React.JSX.Element {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = statusFilter ? `/api/orders?status=${statusFilter}` : "/api/orders"
        const res = await fetch(url, { credentials: "include" })
        const json = await res.json()
        if (json.success) setOrders(json.data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [statusFilter])

  const filtered = orders.filter((o) => {
    if (!search) return true
    const q = search.toLowerCase()
    return o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
  })

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>
          Gestión de Pedidos
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número o nombre..."
              className="w-full bg-[var(--color-dark-card)] border border-[#333] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-dark-card)] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="PAYMENT_PENDING">Pago Pendiente</option>
            <option value="PAYMENT_REVIEW">En Revisión</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="PROCESSING">Procesando</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl divide-y divide-[#222]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between animate-pulse">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-40 bg-white/10 rounded" />
                  <div className="h-2.5 w-24 bg-white/10 rounded" />
                </div>
                <div className="h-3 w-20 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-12 text-center">
            <p className="text-[var(--color-muted)] text-sm">No se encontraron pedidos.</p>
          </div>
        ) : (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-6 gap-4 px-4 py-3 border-b border-[#222] text-xs font-medium text-[var(--color-muted)]">
              <span>Nº Pedido</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span className="text-right">Total</span>
              <span>Estado</span>
              <span>Pago</span>
            </div>
            {filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/office/pedidos/${order.id}`)}
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 px-4 py-3 border-b border-[#222] last:border-b-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm text-[var(--color-gold)] font-medium">#{order.orderNumber}</span>
                <span className="text-sm text-white truncate">{order.customerName}</span>
                <span className="text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</span>
                <span className="text-sm text-white text-right font-medium">${order.total.toFixed(2)}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border w-fit ${STATUS_COLORS[order.status] || "text-[var(--color-muted)] bg-white/5 border-[#333]"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border w-fit ${PAYMENT_COLORS[order.payment?.status || "PENDING"] || "text-[var(--color-muted)] bg-white/5 border-[#333]"}`}>
                  {PAYMENT_LABELS[order.payment?.status || "PENDING"] || "Sin pago"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

export default PedidosPage
