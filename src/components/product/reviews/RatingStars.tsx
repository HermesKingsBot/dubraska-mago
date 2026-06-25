"use client"

interface RatingStarsProps {
  rating: number
  size?: "sm" | "md" | "lg"
}

const SIZES = { sm: 12, md: 16, lg: 20 }

export default function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const px = SIZES[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, rating - star + 1))
        return (
          <svg
            key={star}
            width={px}
            height={px}
            viewBox="0 0 24 24"
            className="relative"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="2"
            />
            <clipPath id={`star-clip-${star}`}>
              <rect x="0" y="0" width={24 * fill} height="24" />
            </clipPath>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--color-gold)"
              clipPath={`url(#star-clip-${star})`}
            />
          </svg>
        )
      })}
    </div>
  )
}
