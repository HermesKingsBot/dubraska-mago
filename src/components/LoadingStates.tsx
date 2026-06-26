"use client"

import { motion } from "motion/react"

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[var(--color-bg)] border border-white/5">
      <div className="relative aspect-square bg-[var(--color-dark-card)] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 rounded bg-[var(--color-dark-card)] w-1/3" />
        <div className="h-4 rounded bg-[var(--color-dark-card)] w-3/4" />
        <div className="h-3 rounded bg-[var(--color-dark-card)] w-full" />
        <div className="h-5 rounded bg-[var(--color-dark-card)] w-1/2" />
      </div>
    </div>
  )
}

export function ActionSpinner({ size = 20 }: { size?: number }) {
  return (
    <motion.div
      className="inline-block"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    </motion.div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-3xl tracking-tight text-[var(--color-gold)]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          DUBRASKA MAGO<sup className="text-xs">®</sup>
        </motion.div>
        <motion.div
          className="w-12 h-0.5 rounded-full bg-[var(--color-gold)]"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

export function ButtonSpinner() {
  return (
    <motion.div
      className="inline-flex items-center gap-2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      <ActionSpinner size={16} />
      <span className="text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Procesando...
      </span>
    </motion.div>
  )
}

export default { ProductCardSkeleton, ActionSpinner, PageLoader, ButtonSpinner }
