"use client"

import { motion } from "motion/react"
import {
  Banknote,
  Smartphone,
  Mail,
  DollarSign,
  Landmark,
} from "lucide-react"

interface PaymentMethodSelectorProps {
  selected: string
  onSelect: (method: string) => void
}

const methods = [
  {
    id: "transferencia",
    label: "Transferencia",
    icon: Landmark,
    detail: "Banco XYZ, Cuenta XXXX, CI XXXXXXXX",
  },
  {
    id: "pago_movil",
    label: "Pago Móvil",
    icon: Smartphone,
    detail: "0414-XXXXXXX, CI: XXXXXXXX",
  },
  {
    id: "zelle",
    label: "Zelle",
    icon: Mail,
    detail: "email@example.com",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: DollarSign,
    detail: "email@example.com",
  },
  {
    id: "efectivo",
    label: "Efectivo",
    icon: Banknote,
    detail: "Pago en efectivo al recibir tu pedido",
  },
]

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {methods.map((m) => {
        const isSelected = selected === m.id
        const Icon = m.icon
        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className="w-full flex items-center gap-4 p-4 rounded-lg text-left transition-colors"
            style={{
              backgroundColor: "var(--color-dark-card)",
              border: isSelected
                ? "2px solid var(--color-gold)"
                : "2px solid transparent",
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isSelected
                  ? "var(--color-gold)"
                  : "var(--color-dark-accent)",
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isSelected
                    ? "var(--color-bg)"
                    : "var(--color-muted)",
                }}
              />
            </div>
            <div className="flex-1">
              <span
                className="text-sm font-medium"
                style={{
                  color: isSelected
                    ? "var(--color-gold)"
                    : "var(--color-white)",
                }}
              >
                {m.label}
              </span>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: isSelected
                  ? "var(--color-gold)"
                  : "var(--color-muted)",
              }}
            >
              {isSelected && (
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-gold)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          </motion.button>
        )
      })}

      {selected && (
        <motion.div
          key={selected}
          className="p-4 rounded-lg text-sm"
          style={{
            backgroundColor: "var(--color-dark-accent)",
            border: "1px solid var(--color-gold)",
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-[var(--color-muted)] mb-1">Datos para el pago:</p>
          <p className="text-[var(--color-white)] font-medium">
            {methods.find((m) => m.id === selected)?.detail}
          </p>
        </motion.div>
      )}
    </div>
  )
}
