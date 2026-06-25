"use client"

import { useState, useEffect } from "react"

interface PriceRangeSliderProps {
  min: number
  max: number
  valueMin: string
  valueMax: string
  onChange: (min: string, max: string) => void
}

export default function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(valueMin)
  const [localMax, setLocalMax] = useState(valueMax)

  useEffect(() => {
    setLocalMin(valueMin)
    setLocalMax(valueMax)
  }, [valueMin, valueMax])

  const numMin = localMin ? parseFloat(localMin) : min
  const numMax = localMax ? parseFloat(localMax) : max
  const totalRange = max - min || 1
  const leftPercent = ((numMin - min) / totalRange) * 100
  const rightPercent = 100 - ((numMax - min) / totalRange) * 100

  const handleMinChange = (val: string) => {
    setLocalMin(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num >= min && num <= (parseFloat(localMax) || max)) {
      onChange(val, localMax)
    }
  }

  const handleMaxChange = (val: string) => {
    setLocalMax(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num <= max && num >= (parseFloat(localMin) || min)) {
      onChange(localMin, val)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative h-1.5 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-[var(--color-gold)]/60 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] text-xs">$</span>
          <input
            type="number"
            placeholder={`${min}`}
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
        <span className="text-[var(--color-muted)] text-xs">—</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] text-xs">$</span>
          <input
            type="number"
            placeholder={`${max}`}
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>
    </div>
  )
}
