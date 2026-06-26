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

export function CartPageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--color-dark-card)]">
          <div className="w-24 h-24 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-1/3 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-8 w-28 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden self-start">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CartSummarySkeleton() {
  return (
    <div className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
      <div className="h-6 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between">
          <div className="h-5 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-5 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
      <div className="h-12 w-full rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden mt-4">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-40 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-12 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-24 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function CheckoutProgressSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-20 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          {i < 2 && <div className="w-16 h-0.5 rounded bg-[var(--color-dark-card)] relative overflow-hidden ml-2">
            <Shimmer className="absolute inset-0" />
          </div>}
        </div>
      ))}
    </div>
  )
}

export default {
  CartPageSkeleton,
  CartSummarySkeleton,
  CheckoutFormSkeleton,
  CheckoutProgressSkeleton,
}
