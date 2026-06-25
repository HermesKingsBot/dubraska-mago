"use client"

interface RatingBarProps {
  star: number
  count: number
  total: number
}

export default function RatingBar({ star, count, total }: RatingBarProps) {
  const pct = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs text-[var(--color-muted)] w-3 text-right"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {star}
      </span>
      <svg width="12" height="12" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="var(--color-gold)"
        />
      </svg>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-gold)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="text-xs text-[var(--color-muted)] w-6"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {count}
      </span>
    </div>
  )
}
