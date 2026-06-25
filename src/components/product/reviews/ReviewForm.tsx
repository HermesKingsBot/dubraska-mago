"use client"

import { useState } from "react"
import RatingStars from "./RatingStars"

interface ReviewFormProps {
  onSubmit: (data: {
    name: string
    email: string
    rating: number
    title: string
    comment: string
  }) => void
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !rating || !comment) return
    onSubmit({ name, email, rating, title, comment })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-[var(--color-dark-card)] border border-white/5">
      <h3
        className="text-lg text-white mb-4"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Escribir una reseña
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>
            Nombre *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>
            Email (opcional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-[var(--color-muted)] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          Calificación *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={star <= rating ? "var(--color-gold)" : "none"}
                  stroke="var(--color-gold)"
                  strokeWidth="2"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-[var(--color-muted)] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>
          Título (opcional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-gold)] focus:outline-none transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs text-[var(--color-muted)] mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>
          Comentario *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-gold)] focus:outline-none transition-colors resize-none"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <button
        type="submit"
        disabled={!name || !rating || !comment}
        className="px-6 py-2.5 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Enviar reseña
      </button>
    </form>
  )
}
