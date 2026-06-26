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

export function NosotrosSkeleton() {
  return (
    <div className="space-y-20 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
        <div className="h-12 w-80 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-5 w-96 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden shrink-0">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-5 w-40 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-3/4 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-10 w-24 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-28 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FAQSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <div className="h-10 w-64 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-3/4 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="w-6 h-6 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                <Shimmer className="absolute inset-0" />
              </div>
            </div>
            <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContactoSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <div className="h-10 w-48 mx-auto mb-12 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-12 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-20 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-12 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-16 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-32 w-full rounded-lg bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          <div className="h-12 w-36 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-[var(--color-dark-card)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-accent)] relative overflow-hidden shrink-0">
                <Shimmer className="absolute inset-0" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-28 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
                <div className="h-3 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              </div>
            </div>
          ))}
          <div className="h-64 w-full rounded-xl bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PoliticasSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <div className="h-12 w-72 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-48 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-2/3 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PrivacidadSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <div className="h-12 w-64 mx-auto rounded bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-56 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-full rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
            <div className="h-4 w-3/4 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
              <Shimmer className="absolute inset-0" />
            </div>
          </div>
          {i % 3 === 0 && (
            <div className="p-5 rounded-xl bg-[var(--color-dark-card)] space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
                  <Shimmer className="absolute inset-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default {
  NosotrosSkeleton,
  FAQSkeleton,
  ContactoSkeleton,
  PoliticasSkeleton,
  PrivacidadSkeleton,
}
