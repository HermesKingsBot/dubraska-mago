"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Review } from "@/types/product"
import RatingStars from "./reviews/RatingStars"
import RatingBar from "./reviews/RatingBar"
import ReviewCard from "./reviews/ReviewCard"
import ReviewForm from "./reviews/ReviewForm"
import ReviewSuccess from "./reviews/ReviewSuccess"

interface ProductReviewsProps {
  productId: string
  initialReviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}

const REVIEWS_PER_PAGE = 5

export default function ProductReviews({
  productId,
  initialReviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState(initialReviews)

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  const paginatedReviews = reviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  )

  const handleSubmitReview = async (data: {
    name: string
    email: string
    rating: number
    title: string
    comment: string
  }) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productId }),
      })
      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
        setShowForm(false)
      }
    } catch {
      void 0
    }
  }

  return (
    <div className="mt-16">
      <h2
        className="text-2xl sm:text-3xl text-white mb-8"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Reseñas de <em className="text-[var(--color-gold)]">clientes</em>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-[var(--color-dark-card)] border border-white/5">
          <span
            className="text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {averageRating.toFixed(1)}
          </span>
          <RatingStars rating={averageRating} size="lg" />
          <span
            className="text-xs text-[var(--color-muted)] mt-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {totalReviews} reseñas
          </span>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              star={star}
              count={ratingDistribution[star] || 0}
              total={totalReviews}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setShowForm(!showForm)
            setSubmitted(false)
          }}
          className="px-6 py-2.5 rounded-full border border-[var(--color-gold)] text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/10 transition-colors"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {showForm ? "Cancelar" : "Escribir reseña"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <ReviewForm onSubmit={handleSubmitReview} />
          </motion.div>
        )}
      </AnimatePresence>

      {submitted && <ReviewSuccess />}

      <div className="flex flex-col gap-4">
        {paginatedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                p === page
                  ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                  : "bg-white/5 text-[var(--color-muted)] hover:bg-white/10"
              }`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
