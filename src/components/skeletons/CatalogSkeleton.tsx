"use client"

import { motion } from "motion/react"
import { ProductCardSkeleton } from "@/components/LoadingStates"

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export function FilterBarSkeleton() {
  return (
    <div className="py-6 px-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden px-5" style={{ width: `${60 + i * 15}px` }}>
            <Shimmer className="absolute inset-0" />
          </div>
        ))}
        <div className="flex-1 min-w-[200px]">
          <div className="h-10 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="h-10 w-40 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="py-8 px-4 flex justify-center items-center gap-2">
      <div className="h-10 w-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      ))}
      <div className="h-10 w-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function LayoutToggleSkeleton() {
  return (
    <div className="flex gap-2">
      <div className="w-10 h-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="w-10 h-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="relative w-full max-w-md">
      <div className="h-12 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export default {
  FilterBarSkeleton,
  ProductGridSkeleton,
  PaginationSkeleton,
  LayoutToggleSkeleton,
  SearchBarSkeleton,
}
