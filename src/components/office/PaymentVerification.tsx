"use client"

import React, { useState } from "react"

interface PaymentData {
  id: string
  amount: number
  method: string
  reference: string | null
  proofImageUrl: string | null
  status: string
  adminNote: string | null
}

interface PaymentVerificationProps {
  payment: PaymentData
  orderId: string
  onVerified: (payment: { status: string; adminNote: string | null }) => void
}

const METHOD_LABELS: Record<string, string> = {
  transferencia: "Transferencia Bancaria",
  pago_movil: "Pago Móvil",
  zelle: "Zelle",
  paypal: "PayPal",
  efectivo: "Efectivo",
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400",
  APPROVED: "text-green-400",
  REJECTED: "text-red-400",
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
}

function PaymentVerification({ payment, orderId, onVerified }: PaymentVerificationProps): React.JSX.Element {
  const [adminNote, setAdminNote] = useState(payment.adminNote || "")
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"APPROVED" | "REJECTED" | null>(null)

  async function handleVerify(status: "APPROVED" | "REJECTED") {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: adminNote || undefined }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          onVerified({ status, adminNote })
        }
      }
    } finally {
      setLoading(false)
      setConfirmAction(null)
    }
  }

  return (
    <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Verificación de Pago</h2>
        <span className={`text-xs font-bold ${STATUS_COLORS[payment.status] || "text-[var(--color-muted)]"}`}>
          {STATUS_LABELS[payment.status] || payment.status}
        </span>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-[var(--color-muted)]">Método</span>
          <span className="text-white">{METHOD_LABELS[payment.method] || payment.method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted)]">Monto</span>
          <span className="text-white font-medium">${payment.amount.toFixed(2)}</span>
        </div>
        {payment.reference && (
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Referencia</span>
            <span className="text-white">{payment.reference}</span>
          </div>
        )}
      </div>

      {payment.proofImageUrl && (
        <div>
          <p className="text-xs text-[var(--color-muted)] mb-2">Comprobante:</p>
          <div
            onClick={() => setExpanded(true)}
            className="relative w-full h-32 rounded-lg overflow-hidden border border-[#333] cursor-pointer hover:border-[var(--color-gold)]/50 transition-colors group"
          >
            <img src={payment.proofImageUrl} alt="Comprobante" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {payment.status === "PENDING" && (
        <>
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Nota Admin</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Observaciones sobre el pago..."
              rows={2}
              className="w-full bg-[var(--color-bg)] border border-[#333] rounded-lg px-3 py-2 text-sm text-white placeholder-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfirmAction("REJECTED")}
              disabled={loading}
              className="py-2.5 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            >
              Rechazar
            </button>
            <button
              onClick={() => setConfirmAction("APPROVED")}
              disabled={loading}
              className="py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-40"
            >
              Aprobar
            </button>
          </div>
        </>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[var(--color-dark-card)] border border-[#333] rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>
              {confirmAction === "APPROVED" ? "Aprobar Pago" : "Rechazar Pago"}
            </h3>
            <p className="text-sm text-[var(--color-muted)]">
              ¿Está seguro que desea {confirmAction === "APPROVED" ? "aprobar" : "rechazar"} este pago de ${payment.amount.toFixed(2)}?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="py-2.5 rounded-lg text-sm font-medium border border-[#333] text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleVerify(confirmAction)}
                disabled={loading}
                className={`py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
                  confirmAction === "APPROVED"
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {loading ? "Procesando..." : confirmAction === "APPROVED" ? "Aprobar" : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {expanded && payment.proofImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          <img src={payment.proofImageUrl} alt="Comprobante ampliado" className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  )
}

export default PaymentVerification
