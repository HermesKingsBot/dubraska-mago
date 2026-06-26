"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface OrderProduct { id: string; name: string; image: string }
interface OrderItem { id: string; quantity: number; price: number; product?: OrderProduct }
interface Payment { id: string; amount: number; method: string; reference: string | null; proofImageUrl: string | null; status: string }
interface Order {
  id: string; orderNumber: string; status: string; total: number; subtotal: number; shippingCost: number
  createdAt: string; shippingName: string; shippingPhone: string; shippingStreet: string; shippingCity: string
  shippingState: string; shippingZip: string | null; shippingCarrier: string | null; shippingOffice: string | null
  shippingRef: string | null; items: OrderItem[]; payment?: Payment | null
}

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
const STATUS_LABELS: Record<string, string> = {
  PAYMENT_PENDING: "Pago Pendiente", PAYMENT_REVIEW: "Revisión de Pago", PENDING: "Pendiente",
  CONFIRMED: "Confirmado", PROCESSING: "Procesando", SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado",
}
const PAYMENT_STATUS: Record<string, string> = { PENDING: "Pendiente", SUBMITTED: "Enviado", APPROVED: "Aprobado", REJECTED: "Rechazado" }

function Timeline({ status }: { status: string }) {
  const idx = STATUSES.indexOf(status)
  if (status === "CANCELLED") return <div className="text-center py-4"><span className="text-red-400 font-medium">Pedido Cancelado</span></div>
  return (
    <div className="flex items-center justify-between relative">
      <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10" />
      <div className="absolute top-3 left-0 h-0.5 bg-[var(--color-gold)]" style={{ width: `${idx >= 0 ? (idx / 4) * 100 : 0}%` }} />
      {STATUSES.map((s, i) => (
        <div key={s} className="relative z-10 flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i <= idx ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "bg-[var(--color-bg)] border-white/20"}`}>
            {i <= idx && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
          </div>
          <span className="text-xs mt-2 text-[var(--color-muted)] hidden sm:block">{STATUS_LABELS[s]}</span>
        </div>
      ))}
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/customer/orders/${orderNumber}`, { credentials: "include" })
      .then(r => r.json()).then(j => { if (j.success) setOrder(j.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" /></div>
  if (!order) return <div className="text-center py-20"><p className="text-[var(--color-muted)] mb-4">Pedido no encontrado</p><Link href="/cuenta/pedidos" className="text-[var(--color-gold)] text-sm hover:underline">Volver a Mis Pedidos</Link></div>

  return (
    <div className="space-y-8">
      <div>
        <Link href="/cuenta/pedidos" className="text-[var(--color-muted)] text-sm hover:text-white transition-colors">← Volver a Mis Pedidos</Link>
        <h2 className="text-2xl mt-2" style={{ fontFamily: "var(--font-playfair)" }}>Pedido #{order.orderNumber}</h2>
        <p className="text-[var(--color-muted)] text-sm mt-1">{new Date(order.createdAt).toLocaleDateString("es-VE")}</p>
      </div>

      <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6">
        <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Estado del Pedido</h3>
        <Timeline status={order.status} />
      </div>

      <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6">
        <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Artículos</h3>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden shrink-0 relative">
                {item.product?.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product?.name || "Producto"}</p>
                <p className="text-[var(--color-muted)] text-xs">Cantidad: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[var(--color-muted)]">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[var(--color-muted)]">Envío</span><span>${order.shippingCost.toFixed(2)}</span></div>
          <div className="flex justify-between text-base font-medium"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6">
        <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Dirección de Envío</h3>
        <div className="text-sm space-y-1 text-[var(--color-muted)]">
          <p className="text-white font-medium">{order.shippingName}</p>
          <p>{order.shippingStreet}</p>
          <p>{order.shippingCity}, {order.shippingState}{order.shippingZip ? ` ${order.shippingZip}` : ""}</p>
          <p>Tel: {order.shippingPhone}</p>
          {order.shippingCarrier && <p>Transportadora: {order.shippingCarrier}{order.shippingOffice ? ` - ${order.shippingOffice}` : ""}</p>}
          {order.shippingRef && <p>Referencia: {order.shippingRef}</p>}
        </div>
      </div>

      <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6">
        <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Pago</h3>
        {order.payment ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Estado</span><span>{PAYMENT_STATUS[order.payment.status] || order.payment.status}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Método</span><span className="capitalize">{order.payment.method}</span></div>
            {order.payment.reference && <div className="flex justify-between"><span className="text-[var(--color-muted)]">Referencia</span><span>{order.payment.reference}</span></div>}
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Monto</span><span>${order.payment.amount.toFixed(2)}</span></div>
          </div>
        ) : (
          <div className="space-y-4">
            {order.status === "PAYMENT_PENDING" ? (
              <>
                <p className="text-[var(--color-muted)] text-sm">Aún no has registrado tu pago</p>
                <Link href={`/cuenta/pedidos/${order.orderNumber}/pago`} className="inline-block bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Subir Comprobante
                </Link>
              </>
            ) : (
              <p className="text-[var(--color-muted)] text-sm">
                {order.status === "PAYMENT_REVIEW" || order.status === "PAYMENT_SUBMITTED" ? "Esperando verificación del admin" : "Sin información de pago"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
