"use client"

import React, { useState, useRef } from "react"

interface PaymentUploadProps {
  orderNumber: string
  orderId: string
  onSubmitted?: () => void
}

const METHODS = [
  { value: "transferencia", label: "Transferencia Bancaria" },
  { value: "pago_movil", label: "Pago Móvil" },
  { value: "zelle", label: "Zelle" },
  { value: "paypal", label: "PayPal" },
  { value: "efectivo", label: "Efectivo" },
]

const INSTRUCTIONS: Record<string, string> = {
  transferencia: "Realice la transferencia a la cuenta indicada y suba el comprobante.",
  pago_movil: "Envíe el pago móvil y capture el número de referencia.",
  zelle: "Envíe el pago a nuestro correo de Zelle y adjunte el comprobante.",
  paypal: "Realice el pago a nuestro correo de PayPal y adjunte el comprobante.",
  efectivo: "El pago será verificado en persona. Adjunte el comprobante si aplica.",
}

const inputCls = "w-full bg-[var(--color-bg)] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"

function PaymentUpload({ orderNumber, orderId, onSubmitted }: PaymentUploadProps): React.JSX.Element {
  const [method, setMethod] = useState("")
  const [reference, setReference] = useState("")
  const [amount, setAmount] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(selected: File | null) {
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type.startsWith("image/")) handleFileSelect(dropped)
  }

  async function handleSubmit() {
    if (!method || !amount) {
      setError("Complete todos los campos obligatorios.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/customer/payments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          method,
          reference: reference || undefined,
          amount: parseFloat(amount),
          proofImageUrl: preview || undefined,
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || "Error al enviar el pago")
      }
      setSubmitted(true)
      onSubmitted?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el pago")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-dark-card)] border border-green-500/30 rounded-xl p-6 text-center space-y-4">
        <svg className="w-12 h-12 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>Pago Enviado</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Tu comprobante de pago para el pedido #{orderNumber} ha sido enviado correctamente. Será verificado por nuestro equipo.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>Subir Comprobante de Pago</h3>
        <p className="text-sm text-[var(--color-muted)]">Pedido: <span className="text-[var(--color-gold)]">#{orderNumber}</span></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Método de Pago *</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
          <option value="">Seleccionar método</option>
          {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        {method && <p className="mt-2 text-xs text-[var(--color-muted)] bg-[var(--color-bg)] rounded-lg px-3 py-2 border border-[#222]">{INSTRUCTIONS[method]}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Monto Pagado *</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Referencia</label>
          <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Número de referencia" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Comprobante de Pago</label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--color-gold)]/50 transition-colors"
        >
          {preview ? (
            <div className="space-y-3">
              <img src={preview} alt="Vista previa" className="max-h-48 mx-auto rounded-lg object-contain" />
              <p className="text-xs text-[var(--color-muted)]">{file?.name}</p>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-8 h-8 mx-auto text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-[var(--color-muted)]">Arrastre una imagen o haga clic para seleccionar</p>
              <p className="text-xs text-[var(--color-muted)]">PNG, JPG, máx. 5MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} className="hidden" />
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || !method || !amount}
        className="w-full bg-[var(--color-gold)] text-black font-medium py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando...
          </span>
        ) : "Enviar Comprobante"}
      </button>
    </div>
  )
}

export default PaymentUpload
