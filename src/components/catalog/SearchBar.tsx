"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface SearchBarProps {
  value: string
  onSearch: (q: string) => void
}

interface Suggestion {
  name: string
  slug: string
}

const RECENT_KEY = "dubraska_recent_searches"
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentSearch(q: string) {
  if (typeof window === "undefined" || !q.trim()) return
  try {
    const recent = getRecentSearches().filter((r) => r !== q)
    recent.unshift(q)
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
  } catch {
    // ignore
  }
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searching, setSearching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=5`, {
        cache: "no-store",
      })
      const json = await res.json()
      if (json.success) {
        setSuggestions(
          (json.data.items || []).map((p: Record<string, unknown>) => ({
            name: String(p.name),
            slug: String(p.slug),
          }))
        )
      }
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setLocalValue(val)
      setSelectedIndex(-1)
      setShowDropdown(true)
      setRecentSearches(getRecentSearches())

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(val)
      }, 300)
    },
    [fetchSuggestions]
  )

  const handleSubmit = useCallback(
    (q: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      saveRecentSearch(q)
      setRecentSearches(getRecentSearches())
      onSearch(q)
      setShowDropdown(false)
      setSuggestions([])
      inputRef.current?.blur()
    },
    [onSearch]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = suggestions.length > 0 ? suggestions : recentSearches
      if (!showDropdown || items.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        const selected = suggestions.length > 0
          ? suggestions[selectedIndex].name
          : recentSearches[selectedIndex]
        if (selected) {
          setLocalValue(selected)
          handleSubmit(selected)
        }
      } else if (e.key === "Escape") {
        setShowDropdown(false)
      }
    },
    [suggestions, recentSearches, showDropdown, selectedIndex, handleSubmit]
  )

  const handleClear = useCallback(() => {
    setLocalValue("")
    setSuggestions([])
    setShowDropdown(false)
    onSearch("")
  }, [onSearch])

  const handleSelectSuggestion = useCallback(
    (name: string) => {
      setLocalValue(name)
      handleSubmit(name)
    },
    [handleSubmit]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showSuggestions = showDropdown && (suggestions.length > 0 || recentSearches.length > 0)

  return (
    <div ref={dropdownRef} className="relative">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(localValue) }} className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
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
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => {
            setShowDropdown(true)
            setRecentSearches(getRecentSearches())
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar joyas..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-label="Buscar productos"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white transition-colors"
            aria-label="Limpiar búsqueda"
          >
            {searching ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            )}
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-white/10 bg-[var(--color-bg)] shadow-xl z-30 overflow-hidden">
          {suggestions.length > 0 && (
            <div>
              <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] border-b border-white/5" style={{ fontFamily: "var(--font-inter)" }}>
                Sugerencias
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={s.slug}
                  onClick={() => handleSelectSuggestion(s.name)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedIndex === i
                      ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                      : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && suggestions.length === 0 && (
            <div>
              <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] border-b border-white/5" style={{ fontFamily: "var(--font-inter)" }}>
                Búsquedas recientes
              </p>
              {recentSearches.map((r, i) => (
                <button
                  key={r}
                  onClick={() => handleSelectSuggestion(r)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedIndex === i
                      ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                      : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <svg className="inline-block mr-2 opacity-40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
