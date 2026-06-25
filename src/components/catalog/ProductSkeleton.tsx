"use client"

interface ProductSkeletonProps {
  layout: 4 | 2 | 1
  count?: number
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-[var(--color-bg)] border border-white/5">
      <div className="aspect-square bg-white/5 animate-pulse" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="h-2.5 w-16 bg-white/10 rounded" />
        </div>
        <div className="h-3.5 w-3/4 bg-white/10 rounded" />
        <div className="h-2.5 w-1/2 bg-white/10 rounded" />
        <div className="h-5 w-20 bg-white/10 rounded mt-2" />
        <div className="h-9 w-full bg-white/10 rounded-lg mt-2" />
      </div>
    </div>
  )
}

export default function ProductSkeleton({ layout, count }: ProductSkeletonProps) {
  const gridClass =
    layout === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : layout === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1"

  const items = count || (layout === 4 ? 8 : layout === 2 ? 4 : 3)

  return (
    <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
