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

export function HeroEnviosSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="h-12 w-80 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-6 w-96 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function TransportadorasSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 w-56 mx-auto mb-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="h-5 w-28 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-3/4 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
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

export function EnvioDetalleSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-48 mx-auto mb-10 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                {i < 4 && <div className="w-0.5 h-12 bg-[var(--color-dark-card)] relative overflow-hidden mt-2">
                  <Shimmer className="absolute inset-0" />
                </div>}
              </div>
              <div className="pt-2 space-y-2 flex-1">
                <div className="h-4 w-36 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
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

export function CobroDestinoSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="p-6 rounded-xl bg-[var(--color-dark-card)] space-y-4">
          <div className="h-6 w-48 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="rounded-lg overflow-hidden mt-4">
            <div className="grid grid-cols-3 gap-4 p-3 bg-[var(--color-dark-accent)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-[var(--color-bg)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-3 border-t border-white/5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-3 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                    <Shimmer className="absolute inset-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BannerDevolucionesSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 rounded-xl bg-[var(--color-dark-card)] text-center space-y-4">
          <div className="h-8 w-64 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-4 w-96 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-48 mx-auto rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default {
  HeroEnviosSkeleton,
  TransportadorasSkeleton,
  EnvioDetalleSkeleton,
  CobroDestinoSkeleton,
  BannerDevolucionesSkeleton,
}
