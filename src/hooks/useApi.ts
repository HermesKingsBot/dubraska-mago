"use client"

import { useState, useCallback } from "react"

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  fetch: (url: string, init?: RequestInit) => Promise<T | null>
  reset: () => void
}

export function useApi<T>(): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(
    async (url: string, init?: RequestInit): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, {
          ...init,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...init?.headers,
          },
        })
        const json = await res.json()
        if (!json.success) {
          setError(json.error || "Request failed")
          return null
        }
        setData(json.data)
        return json.data
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error"
        setError(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, fetch: fetchData, reset }
}

export default useApi
