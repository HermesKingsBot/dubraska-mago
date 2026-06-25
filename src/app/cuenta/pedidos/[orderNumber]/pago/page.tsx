"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Order { id: string; orderNumber: string; total: number; status: string }

const METHODS = [
  { value: "transferencia", label: "Transferencia Bancaria" },
  { value: "pago_movil", label: "Pago Móvil" },
  { value: "zelle", label: "Zelle" },
  { value: "paypal", label: "PayPal" },
  { value: "efectivo", label: "Efectivo" },
]

const INSTRUCTIONS: Record<string, string> = {
  transferencia: "Realiza una transferencia bancaria por el monto total y sube el comprobante.",
  pago_movil: "Realiza un pago móvil y captura el comprobante. Incluye la referencia.",
  zelle: "Envía el pago por Zelle y sube el comprobante de la transacción.",
  paypal: "Realiza el pago por PayPal y captura el comprobante.",
  efectivo: "El pago se realizará en efectivo al momento de la entrega.",
}

export default function PaymentUploadPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.orderNumber as string
  const fileRef = useRef<HTMLInputElement>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [method, setMethod] = useState("transferencia")
  const [reference, setReference] = useState("")
  const [amount, setAmount] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/customer/orders/${orderNumber}`, { credentials: "include" })
      .then(r => r.json()).then(j => { if (j.success) { setOrder(j.data); setAmount(j.data.total.toString()) } })
      .catch(() => {}).finally(() => setLoading(false))
  }, [orderNumber])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setProofFile(f); const r = new FileReader(); r.onloadend = () => setPreview(r.result as string); r.readAsDataURL(f) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setSubmitting(true); setError("")
    try {
      let proofImageUrl = ""
      if (proofFile) {
        const fd = new FormData(); fd.append("file", proofFile)
        const ur = await fetch("/api/upload", { method: "POST", body: fd })
        const uj = await ur.json()
        if (uj.success && uj.data?.url) proofImageUrl = uj.data.url
      }
      const res = await fetch("/api/customer/payments", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, method, reference: reference || undefined, amount: parseFloat(amount) || order.total, proofImageUrl: proofImageUrl || undefined }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.error || "Error al registrar el pago"); return }
      router.push(`/cuenta/pedidos/${orderNumber}?payment=success`)
    } catch { setError("Error de red") } finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" /></div>
  if (!order) return <div className="text-center py-20"><p className="text-[var(--color-muted)] mb-4">Pedido no encontrado</p><Link href="/cuenta/pedidos" className="text-[var(--color-gold)] text-sm hover:underline">Volver a Mis Pedidos</Link></div>

  const inputCls = "w-full bg-[var(--color-dark-card)] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)]"

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <Link href={`/cuenta/pedidos/${orderNumber}`} className="text-[var(--color-muted)] text-sm hover:text-white transition-colors">← Volver al Pedido</Link>
        <h2 className="text-2xl mt-2" style={{ fontFamily: "var(--font-instrument-serif)" }}>Subir Comprobante de Pago</h2>
        <p className="text-[var(--color-muted)] text-sm mt-1">Pedido #{order.orderNumber} · Total: ${order.total.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Método de Pago</label>
          <select value={method} onChange={e => setMethod(e.target.value)} className={inputCls}>
            {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <p className="text-[var(--color-muted)] text-xs mt-2">{INSTRUCTIONS[method]}</p>
        </div>

        {method !== "efectivo" && (
          <div>
            <label className="block text-sm mb-2">Referencia / Número de Transacción</label>
            <input type="text" value={reference} onChange={e => setReference(e.target.value)} placeholder="Ej: 123456789" className={inputCls} />
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">Monto Pagado</label>
          <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} />
        </div>

        {method !== "efectivo" && (
          <div>
            <label className="block text-sm mb-2">Comprobante de Pago</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full border border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[var(--color-gold)]/50 transition-colors">
              {preview ? (
                <div className="relative w-full h-48 mx-auto"><Image src={preview} alt="Vista previa" fill className="object-contain rounded" /></div>
              ) : (
                <span className="text-[var(--color-muted)] text-sm">Seleccionar imagen del comprobante</span>
              )}
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full bg-[var(--color-gold)] text-black py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {submitting ? "Enviando..." : "Registrar Pago"}
        </button>
      </form>
    </div>
  )
}
