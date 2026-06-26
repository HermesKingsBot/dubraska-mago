"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"

interface OfferCountdownProps {
  oldPrice: number | null
}

function calcTimeLeft() {
  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() + 2)
  end.setHours(23, 59, 59, 0)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
}

export default function OfferCountdown({ oldPrice }: OfferCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (!oldPrice || !timeLeft) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-red-500"
      />
      <span
        className="text-sm text-red-400 font-medium"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Oferta termina en:{" "}
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </motion.div>
  )
}
