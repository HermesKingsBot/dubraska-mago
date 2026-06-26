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

export function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-8 rounded-xl bg-[var(--color-dark-card)]">
      <div className="h-8 w-48 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="h-12 w-full rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-4 w-48 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function RegisterFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-8 rounded-xl bg-[var(--color-dark-card)]">
      <div className="h-8 w-48 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-12 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
          <div className="h-12 w-full rounded-lg bg-[var(--color-bg)] relative overflow-hidden">
            <Shimmer className="absolute inset-0" />
          </div>
        </div>
        <div className="h-12 w-full rounded-full bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-4 w-56 mx-auto rounded bg-[var(--color-dark-accent)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export function UserMenuSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[var(--color-dark-card)] relative overflow-hidden">
        <Shimmer className="absolute inset-0" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-24 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="h-3 w-16 rounded bg-[var(--color-dark-card)] relative overflow-hidden">
          <Shimmer className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}

export default {
  LoginFormSkeleton,
  RegisterFormSkeleton,
  UserMenuSkeleton,
}
