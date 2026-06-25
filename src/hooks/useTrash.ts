"use client"

import { useState, useCallback, useEffect } from "react"

interface TrashData {
  products: Array<{ id: string; name: string; entityType: string; deletedAt: string }>
  categories: Array<{ id: string; name: string; entityType: string; deletedAt: string }>
  testimonials: Array<{ id: string; name: string; entityType: string; deletedAt: string }>
  orders: Array<{ id: string; name: string; entityType: string; deletedAt: string }>
  socialLinks: Array<{ id: string; name: string; entityType: string; deletedAt: string }>
  totalCount: number
}

export function useTrash() {
  const [data, setData] = useState<TrashData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTrash = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/trash", { credentials: "include" })
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTrash() }, [fetchTrash])

  const restore = useCallback(async (type: string, id: string) => {
    const res = await fetch(`/api/trash/${type}/${id}`, {
      method: "POST",
      credentials: "include",
    })
    const json = await res.json()
    if (json.success) await fetchTrash()
    return json.success
  }, [fetchTrash])

  const hardDelete = useCallback(async (type: string, id: string) => {
    const res = await fetch(`/api/trash/${type}/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    const json = await res.json()
    if (json.success) await fetchTrash()
    return json.success
  }, [fetchTrash])

  return { data, loading, trashCount: data?.totalCount ?? 0, restore, hardDelete, refetch: fetchTrash }
}
