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

export function ProfileSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-56 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
      <div className="h-10 w-32 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function AddressListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-36 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-10 w-36 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
          <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-3 w-2/3 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-8 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-8 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-dark-card)]">
          <div className="h-4 w-24 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-28 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-6 w-20 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1" />
          <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="h-8 w-24 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-3 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
            <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
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

export function WishlistSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-36 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-[var(--color-dark-card)] border border-white/5">
            <div className="relative aspect-square bg-[var(--color-dark-accent)] overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-5 w-1/2 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-9 w-full rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default {
  ProfileSkeleton,
  AddressListSkeleton,
  OrderListSkeleton,
  OrderDetailSkeleton,
  WishlistSkeleton,
}
