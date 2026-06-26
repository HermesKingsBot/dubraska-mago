"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCustomerAuth } from "@/context/CustomerAuthContext"

interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: { name: string; image: string }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
}

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

export default function AccountPage() {
  const { user, logout } = useCustomerAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders", { credentials: "include" })
        const json = await res.json()
        if (json.success && json.data) {
          setOrders((json.data as Order[]).slice(0, 3))
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const quickLinks = [
    { label: "Mis Pedidos", href: "/cuenta/pedidos", icon: "📦" },
    { label: "Mi Wishlist", href: "/cuenta/wishlist", icon: "♡" },
    { label: "Direcciones", href: "/cuenta/direcciones", icon: "📍" },
    { label: "Configuración", href: "/cuenta/configuracion", icon: "⚙" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Hola, {user?.name || "Usuario"}
        </h2>
        <p className="text-[var(--color-muted)] text-sm">
          Bienvenido a tu panel de cuenta
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-5 text-center hover:border-[var(--color-gold)]/30 transition-all group"
          >
            <span className="text-2xl block mb-2">{link.icon}</span>
            <span className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Pedidos Recientes
          </h3>
          <Link
            href="/cuenta/pedidos"
            className="text-[var(--color-gold)] text-sm hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {loading ? (
          <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-8 text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-8 text-center">
            <p className="text-[var(--color-muted)] mb-4">
              Aún no tienes pedidos
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
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/cuenta/pedidos/${order.orderNumber}`}
                className="flex items-center justify-between bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-4 hover:border-[var(--color-gold)]/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    #{order.orderNumber}
                  </p>
                  <p className="text-[var(--color-muted)] text-xs mt-1">
                    {new Date(order.createdAt).toLocaleDateString("es-VE")} ·{" "}
                    {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
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

      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="text-[var(--color-muted)] hover:text-red-400 text-sm transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
