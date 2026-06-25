"use client"

import { useState, useEffect, useCallback } from "react"
import type { Testimonial } from "@/types/office"
import type { Testimonial as ApiTestimonial } from "@/types/index"

function mapTestimonial(t: ApiTestimonial): Testimonial {
  return {
    id: t.id,
    name: t.name,
    text: t.text,
    rating: t.rating,
    productId: t.productId || "",
    date: t.date,
    active: t.active,
  }
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)

  const fetchTestimonials = useCallback(async (includeDeleted = false) => {
    try {
      const res = await fetch(`/api/testimonials${includeDeleted ? "?includeDeleted=true" : ""}`, { credentials: "include" })
      const json = await res.json()
      if (json.success) {
        const mapped = (json.data || []).map(mapTestimonial)
        setTestimonials(mapped)
      }
    } catch {
      setTestimonials([])
    }
  }, [])

  useEffect(() => {
    fetchTestimonials(showDeleted).then(() => setLoaded(true))
  }, [fetchTestimonials, showDeleted])

  const addTestimonial = useCallback(
    async (t: Testimonial) => {
      try {
        await fetch("/api/testimonials", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
        })
        await fetchTestimonials()
      } catch {
        // ignore
      }
    },
    [fetchTestimonials]
  )

  const updateTestimonial = useCallback(
    async (id: string, updates: Partial<Testimonial>) => {
      try {
        await fetch(`/api/testimonials/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        await fetchTestimonials()
      } catch {
        // ignore
      }
    },
    [fetchTestimonials]
  )

  const deleteTestimonial = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/testimonials/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
        await fetchTestimonials()
      } catch {
        // ignore
      }
    },
    [fetchTestimonials]
  )

  return { testimonials, loaded, showDeleted, setShowDeleted, addTestimonial, updateTestimonial, deleteTestimonial }
}
