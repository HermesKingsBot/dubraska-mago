"use client"

import { useState, useRef, useCallback } from "react"

interface SearchBarProps {
  value: string
  onSearch: (q: string) => void
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setLocalValue(val)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        onSearch(val)
      }, 350)
    },
    [onSearch]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      onSearch(localValue)
    },
    [localValue, onSearch]
  )

  const handleClear = useCallback(() => {
    setLocalValue("")
    onSearch("")
  }, [onSearch])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Buscar joyas..."
        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#8A8A8A] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
        style={{ fontFamily: "var(--font-inter)" }}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-white transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}
