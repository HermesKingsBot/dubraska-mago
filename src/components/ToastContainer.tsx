"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useToast, Toast } from "@/hooks/useToast"

const ICONS: Record<Toast["type"], React.JSX.Element> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M18 6L6 18M6 6l12 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <motion.path
        d="M12 16v-4M12 8h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  ),
}

const COLORS: Record<Toast["type"], string> = {
  success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  error: "bg-red-500/10 border-red-500/30 text-red-400",
  info: "bg-[var(--color-gold)]/10 border-[var(--color-gold)]/30 text-[var(--color-gold)]",
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const { subscribe } = useToast()

  useEffect(() => {
    return subscribe(setToasts)
  }, [subscribe])

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 100, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md ${COLORS[toast.type]}`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <div className="flex-shrink-0">{ICONS[toast.type]}</div>
            <p className="text-sm text-white">{toast.message}</p>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-full bg-current opacity-30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
