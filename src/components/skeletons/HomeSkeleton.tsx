"use client"

import { motion } from "motion/react"

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

export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-[var(--color-bg)]">
      <Shimmer className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
        <div className="h-16 w-3/4 max-w-xl rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-6 w-1/2 max-w-md rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-12 w-40 mt-4 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function BestSellersSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-64 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-[var(--color-bg)] border border-white/5">
              <div className="relative aspect-square bg-[var(--color-dark-card)] overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="p-4 space-y-3">
                <div className="h-3 rounded bg-[var(--color-dark-card)] w-1/3 relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-4 rounded bg-[var(--color-dark-card)] w-3/4 relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-5 rounded bg-[var(--color-dark-card)] w-1/2 relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CategoriesSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-3 w-16 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-56 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                    <Shimmer className="absolute inset-0" />
                  </div>
                  <div className="h-3 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                    <Shimmer className="absolute inset-0" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-2/3 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeaturesSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-40 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl bg-[var(--color-dark-card)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ColorGuideSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-56 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 rounded-xl bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-5 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-3 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-3 w-2/3 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default {
  HeroSkeleton,
  BestSellersSkeleton,
  CategoriesSkeleton,
  TestimonialsSkeleton,
  FeaturesSkeleton,
  ColorGuideSkeleton,
}
