"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

function ErrorSearch(): React.JSX.Element {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/colecciones?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar joyas, categorías..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--color-dark-accent)] border border-white/10 text-white text-base placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-label="Buscar productos"
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide border-none cursor-pointer bg-[var(--color-gold)] text-[var(--color-bg)] transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.35)]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Buscar
      </motion.button>
    </motion.form>
  )
}

export default ErrorSearch
