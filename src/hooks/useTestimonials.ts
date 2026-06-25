"use client"

import { useState, useEffect, useCallback } from "react"
import type { Testimonial } from "@/types/office"
import testimonialsData from "@/../data/testimonials.json"

const STORAGE_KEY = "office_testimonials"

function loadTestimonials(): Testimonial[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Testimonial[]
    } catch {
      // fall through
    }
  }
  const data = testimonialsData as unknown as Testimonial[]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTestimonials(loadTestimonials())
    setLoaded(true)
  }, [])

  const save = useCallback((next: Testimonial[]) => {
    setTestimonials(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addTestimonial = useCallback(
    (t: Testimonial) => {
      save([...testimonials, t])
    },
    [testimonials, save]
  )

  const updateTestimonial = useCallback(
    (id: string, updates: Partial<Testimonial>) => {
      save(testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    },
    [testimonials, save]
  )

  const deleteTestimonial = useCallback(
    (id: string) => {
      save(testimonials.filter((t) => t.id !== id))
    },
    [testimonials, save]
  )

  return { testimonials, loaded, addTestimonial, updateTestimonial, deleteTestimonial }
}
