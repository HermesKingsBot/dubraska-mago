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

export function FullPageSkeleton() {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-3xl tracking-tight text-[var(--color-gold)]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          DUBRASKA MAGO<sup className="text-xs">®</sup>
        </motion.div>
        <motion.div
          className="w-12 h-0.5 rounded-full bg-[var(--color-gold)]"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="h-10 w-64 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-4 w-3/4 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-4 w-5/6 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
            <div className="h-4 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-2/3 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="rounded-xl bg-[var(--color-dark-card)] overflow-hidden">
      <div className="grid gap-4 p-4 border-b border-white/5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4 p-4 border-b border-white/5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
      <div className="h-5 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
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
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-dark-card)]">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-48 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default {
  FullPageSkeleton,
  ContentSkeleton,
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
}
