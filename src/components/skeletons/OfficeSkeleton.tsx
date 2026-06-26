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

export function OfficeLayoutSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-[var(--color-dark-card)] p-4 space-y-4">
        <div className="h-8 w-40 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-[var(--color-dark-card)] border-b border-white/5 flex items-center px-6 gap-4">
          <div className="h-6 w-48 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="h-8 w-64 rounded bg-[var(--color-dark-card)] relative overflow-hidden mb-6">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-96 w-full rounded-xl bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
            <div className="h-4 w-24 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-8 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-4">
          <div className="h-5 w-36 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-2 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
              <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-4">
          <div className="h-5 w-36 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-2 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
              <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-7 w-40 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-10 w-32 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="rounded-xl bg-[var(--color-dark-card)] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_100px_100px_100px] gap-4 p-4 border-b border-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[auto_1fr_100px_100px_100px] gap-4 p-4 border-b border-white/5 items-center">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductFormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="h-7 w-48 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-11 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-32 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-28 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-32 w-full rounded-lg border-2 border-dashed border-white/10 bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="h-12 w-40 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function CategoryListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-7 w-36 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-10 w-36 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-dark-card)]">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TestimonialListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-44 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-dark-card)]">
          <div className="w-12 h-12 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-3 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="h-7 w-40 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-28 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-11 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      ))}
      <div className="h-12 w-36 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
    </div>
  )
}

export function AuditLogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-32 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="rounded-xl bg-[var(--color-dark-card)] overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 p-4 border-b border-white/5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_120px_100px] gap-4 p-4 border-b border-white/5">
            <div className="h-4 w-48 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-24 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-24 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InventorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-7 w-36 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-10 w-40 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="rounded-xl bg-[var(--color-dark-card)] overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-4 p-4 border-b border-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-4 p-4 border-b border-white/5 items-center">
            <div className="h-4 w-36 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="w-8 h-8 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
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
  OfficeLayoutSkeleton,
  DashboardSkeleton,
  ProductListSkeleton,
  ProductFormSkeleton,
  CategoryListSkeleton,
  TestimonialListSkeleton,
  SettingsFormSkeleton,
  AuditLogSkeleton,
  InventorySkeleton,
}
