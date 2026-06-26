"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import { motion } from "motion/react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import EmptyStates from "@/components/EmptyStates"

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
  const containerRef = useRef<HTMLDivElement>(null)

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

  useGSAP(() => {
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.fromTo(
      containerRef.current.querySelectorAll(".account-card"),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      }
    )
  }, { scope: containerRef })

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const quickLinks = [
    { label: "Mis Pedidos", href: "/cuenta/pedidos", icon: "📦", count: orders.length },
    { label: "Mi Wishlist", href: "/cuenta/wishlist", icon: "♡", count: 0 },
    { label: "Direcciones", href: "/cuenta/direcciones", icon: "📍", count: 0 },
    { label: "Configuración", href: "/cuenta/configuracion", icon: "⚙", count: 0 },
  ]

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold border-2 border-[var(--color-gold)]"
          style={{
            backgroundColor: "var(--color-dark-card)",
            fontFamily: "var(--font-playfair)",
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </motion.div>
        <div>
          <h2
            className="text-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hola, {user?.name || "Usuario"}
          </h2>
          <p className="text-[var(--color-muted)] text-sm">
            Bienvenido a tu panel de cuenta
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="account-card bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-5 text-center hover:border-[var(--color-gold)]/30 transition-all group opacity-0"
          >
            <span className="text-2xl block mb-2">{link.icon}</span>
            <span className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors">
              {link.label}
            </span>
            {link.count > 0 && (
              <span
                className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {link.count}
              </span>
            )}
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
          <EmptyStates variant="empty-orders" />
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
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
              </motion.div>
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
