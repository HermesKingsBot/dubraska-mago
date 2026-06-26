"use client"

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    window.addEventListener("beforeunload", handleComplete)
    return () => {
      window.removeEventListener("beforeunload", handleComplete)
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="overlay"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(90deg, var(--color-gold) 0%, #B8941F 50%, var(--color-gold) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: loading ? 0.3 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
