"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"

interface CheckoutProgressProps {
  currentStep: number
}

const steps = [
  { num: 1, label: "Carrito" },
  { num: 2, label: "Envío" },
  { num: 3, label: "Pago" },
  { num: 4, label: "Confirmación" },
]

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full mb-10">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between relative px-4">
        <div
          className="absolute top-5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-white/10"
          aria-hidden
        />
        <motion.div
          className="absolute top-5 left-[calc(12.5%+8px)] h-px bg-[var(--color-gold)]"
          aria-hidden
          initial={{ width: 0 }}
          animate={{
            width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * (100 - 25))}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {steps.map((s) => {
          const isCompleted = s.num < currentStep
          const isCurrent = s.num === currentStep
          return (
            <div
              key={s.num}
              className="flex flex-col items-center z-10 relative"
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                animate={{
                  backgroundColor: isCurrent || isCompleted
                    ? "var(--color-gold)"
                    : "var(--color-dark-card)",
                  color: isCurrent || isCompleted
                    ? "var(--color-bg)"
                    : "var(--color-muted)",
                  borderColor: isCurrent || isCompleted
                    ? "var(--color-gold)"
                    : "var(--color-dark-accent)",
                }}
                transition={{ duration: 0.3 }}
                style={{ border: "2px solid" }}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  s.num
                )}
              </motion.div>
              <span
                className="mt-2 text-xs font-medium"
                style={{
                  color: isCurrent || isCompleted
                    ? "var(--color-gold)"
                    : "var(--color-muted)",
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex flex-col items-center gap-3 px-2">
        <div className="flex items-center gap-1">
          {steps.map((s, i) => {
            const isCompleted = s.num < currentStep
            const isCurrent = s.num === currentStep
            return (
              <div key={s.num} className="flex items-center">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  animate={{
                    backgroundColor: isCurrent || isCompleted
                      ? "var(--color-gold)"
                      : "var(--color-dark-card)",
                    color: isCurrent || isCompleted
                      ? "var(--color-bg)"
                      : "var(--color-muted)",
                    borderColor: isCurrent || isCompleted
                      ? "var(--color-gold)"
                      : "var(--color-dark-accent)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ border: "2px solid" }}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    s.num
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-white/10 mx-1" />
                )}
              </div>
            )
          })}
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-gold)" }}
        >
          {steps.find((s) => s.num === currentStep)?.label}
        </span>
      </div>
    </div>
  )
}
