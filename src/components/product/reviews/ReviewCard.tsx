"use client"

import { useState } from "react"
import { Review } from "@/types/product"
import RatingStars from "./RatingStars"

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(false)

  const date = new Date(review.createdAt).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-5 rounded-xl bg-[var(--color-dark-card)] border border-white/5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <RatingStars rating={review.rating} size="sm" />
            {review.verified && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Compra verificada
              </span>
            )}
          </div>
          {review.title && (
            <h4
              className="text-sm text-white font-medium mt-1"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {review.title}
            </h4>
          )}
        </div>
        <span
          className="text-xs text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {date}
        </span>
      </div>

      <p
        className="text-sm text-[var(--color-muted)] mb-3"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {review.comment}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-xs text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {review.name}
        </span>
        <button
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            helpful ? "text-[var(--color-gold)]" : "text-[var(--color-muted)] hover:text-white"
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={helpful ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
          </svg>
          Útil {review.helpful > 0 && `(${review.helpful})`}
        </button>
      </div>
    </div>
  )
}
