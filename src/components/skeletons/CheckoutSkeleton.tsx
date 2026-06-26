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

export function OrderSummarySkeleton() {
  return (
    <div className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
      <div className="h-6 w-36 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="w-14 h-14 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-1/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="h-3 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
      <div className="border-t border-white/5 pt-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-3 w-14 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-3 w-10 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="flex justify-between pt-2 border-t border-white/5">
          <div className="h-5 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-5 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PaymentMethodSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-40 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-dark-card)]">
            <div className="w-5 h-5 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AddressFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-11 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-11 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export default {
  OrderSummarySkeleton,
  PaymentMethodSkeleton,
  AddressFormSkeleton,
}
