"use client"

import React, { useEffect, useRef, useState } from "react"

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
}

function StatCard({ icon, value, label }: StatCardProps): React.JSX.Element {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current) return
    animated.current = true
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return (
    <div
      ref={ref}
      className="bg-[#111] border border-[#222] hover:border-[var(--color-gold)]/30 rounded-xl p-5 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-[var(--color-gold)] opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      <p
        className="text-3xl font-bold text-[var(--color-gold)]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {display}
      </p>
      <p className="text-sm text-[var(--color-muted)] mt-1">{label}</p>
    </div>
  )
}

export default StatCard
