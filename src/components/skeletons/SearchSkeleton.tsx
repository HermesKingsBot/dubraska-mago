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

export function SearchOverlaySkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-14 w-full rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-4">
        <div className="h-5 w-28 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden px-4" style={{ width: `${60 + i * 12}px` }}>
              <Shimmer className="absolute inset-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-5 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[var(--color-dark-card)] overflow-hidden">
              <div className="aspect-square bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-4 w-1/2 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
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

export default { SearchOverlaySkeleton }
