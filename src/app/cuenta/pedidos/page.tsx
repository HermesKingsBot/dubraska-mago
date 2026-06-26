"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PAYMENT_PENDING", label: "Pago Pendiente" },
  { value: "PAYMENT_REVIEW", label: "Revisión de Pago" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PROCESSING", label: "Procesando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
]

const STATUS_LABELS: Record<string, string> = {
  PAYMENT_PENDING: "Pago Pendiente",
  PAYMENT_REVIEW: "Revisión de Pago",
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
}

const STATUS_COLORS: Record<string, string> = {
  PAYMENT_PENDING: "bg-yellow-500/20 text-yellow-400",
  PAYMENT_REVIEW: "bg-blue-500/20 text-blue-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  CONFIRMED: "bg-blue-500/20 text-blue-400",
  PROCESSING: "bg-purple-500/20 text-purple-400",
  SHIPPED: "bg-indigo-500/20 text-indigo-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders", { credentials: "include" })
        const json = await res.json()
        if (json.success && json.data) {
          setOrders(json.data as Order[])
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Mis Pedidos
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[var(--color-dark-card)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-gold)]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-12 text-center">
          <p className="text-[var(--color-muted)] mb-4">
            No tienes pedidos aún
          </p>
          <Link
            href="/colecciones"
            className="inline-block bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Explorar Colecciones
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/cuenta/pedidos/${order.orderNumber}`}
              className="flex items-center justify-between bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-4 hover:border-[var(--color-gold)]/30 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">#{order.orderNumber}</p>
                <p className="text-[var(--color-muted)] text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString("es-VE")} ·{" "}
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "artículo" : "artículos"}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-500/20 text-gray-400"}`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="font-medium text-sm whitespace-nowrap">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
