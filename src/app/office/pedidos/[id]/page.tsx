"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import AuthGuard from "@/components/office/AuthGuard"
import PaymentVerification from "@/components/office/PaymentVerification"

interface Payment { id: string; amount: number; method: string; reference: string | null; proofImageUrl: string | null; status: string; adminNote: string | null }

interface Order {
  id: string; orderNumber: string; status: string; customerName: string; customerEmail: string; customerPhone: string | null
  shippingName: string; shippingPhone: string; shippingStreet: string; shippingCity: string; shippingState: string; shippingZip: string | null
  shippingCarrier: string | null; shippingOffice: string | null; shippingRef: string | null
  subtotal: number; shippingCost: number; total: number; notes: string | null; createdAt: string
  items: { id: string; quantity: number; price: number; product: { name: string; image: string; sku: string } }[]
  payment: Payment | null
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" }, { value: "PAYMENT_PENDING", label: "Pago Pendiente" },
  { value: "PAYMENT_REVIEW", label: "En Revisión" }, { value: "CONFIRMED", label: "Confirmado" },
  { value: "PROCESSING", label: "Procesando" }, { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" }, { value: "CANCELLED", label: "Cancelado" },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400", PAYMENT_PENDING: "text-yellow-400", PAYMENT_REVIEW: "text-blue-400",
  CONFIRMED: "text-blue-400", PROCESSING: "text-purple-400", SHIPPED: "text-cyan-400",
  DELIVERED: "text-green-400", CANCELLED: "text-red-400",
}

const cardCls = "bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-5 space-y-4"
const inputCls = "w-full bg-[var(--color-bg)] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"

function OrderDetailPage(): React.JSX.Element {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tracking, setTracking] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`, { credentials: "include" })
        const json = await res.json()
        if (json.success) { setOrder(json.data); setTracking(json.data.shippingRef || "") }
      } catch {} finally { setLoading(false) }
    }
    if (id) load()
  }, [id])

  async function patch(data: Record<string, string>) {
    if (!order) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) { const json = await res.json(); if (json.success) setOrder(json.data) }
    } finally { setSaving(false) }
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${cardCls} animate-pulse`}>
              <div className="h-4 w-32 bg-white/10 rounded mb-3" />
              <div className="h-3 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </AuthGuard>
    )
  }

  if (!order) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-[var(--color-muted)]">Pedido no encontrado.</p>
          <button onClick={() => router.push("/office/pedidos")} className="mt-4 text-sm text-[var(--color-gold)] hover:underline">Volver</button>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/office/pedidos")} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>Pedido #{order.orderNumber}</h1>
            <p className="text-sm text-[var(--color-muted)]">{fmtDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Información del Pedido</h2>
                <span className={`text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                  {STATUS_OPTIONS.find((s) => s.value === order.status)?.label || order.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[var(--color-muted)]">Cliente</p><p className="text-white">{order.customerName}</p></div>
                <div><p className="text-[var(--color-muted)]">Email</p><p className="text-white">{order.customerEmail}</p></div>
                {order.customerPhone && <div><p className="text-[var(--color-muted)]">Teléfono</p><p className="text-white">{order.customerPhone}</p></div>}
              </div>
            </div>
            <div className={cardCls}>
              <h2 className="text-sm font-semibold text-white">Artículos</h2>
              <div className="divide-y divide-[#222]">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img src={it.product.image} alt={it.product.name} className="w-12 h-12 rounded-lg object-cover bg-white/5 flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{it.product.name}</p><p className="text-xs text-[var(--color-muted)]">{it.product.sku}</p></div>
                    <div className="text-right flex-shrink-0"><p className="text-sm text-white">${it.price.toFixed(2)}</p><p className="text-xs text-[var(--color-muted)]">x{it.quantity}</p></div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#222] pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-[var(--color-muted)]"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[var(--color-muted)]"><span>Envío</span><span>${order.shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-white font-semibold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
              </div>
            </div>
            <div className={cardCls}>
              <h2 className="text-sm font-semibold text-white">Dirección de Envío</h2>
              <div className="text-sm text-[var(--color-muted)] space-y-1">
                <p className="text-white">{order.shippingName}</p>
                <p>{order.shippingStreet}</p>
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                {order.shippingCarrier && <p className="mt-2">Transportista: <span className="text-white">{order.shippingCarrier}</span></p>}
                {order.shippingOffice && <p>Código Oficina: <span className="text-white">{order.shippingOffice}</span></p>}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className={cardCls}>
              <h2 className="text-sm font-semibold text-white">Estado del Pedido</h2>
              <select value={order.status} onChange={(e) => patch({ status: e.target.value })} disabled={saving} className={inputCls}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className={cardCls}>
              <h2 className="text-sm font-semibold text-white">Número de Tracking</h2>
              <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Número de tracking" className={inputCls} />
              <button onClick={() => patch({ shippingRef: tracking })} disabled={saving} className="w-full bg-[#222] text-white text-sm py-2.5 rounded-lg hover:bg-[#333] transition-colors border border-[#333]">
                {saving ? "Guardando..." : "Guardar Tracking"}
              </button>
            </div>
            {order.payment && (
              <PaymentVerification payment={order.payment} orderId={order.id} onVerified={(u) => setOrder({ ...order, payment: { ...order.payment!, status: u.status, adminNote: u.adminNote } })} />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default OrderDetailPage
