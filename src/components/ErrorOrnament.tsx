"use client"

import { motion } from "motion/react"

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface ErrorOrnamentProps {
  className?: string
  size?: number
}

function ErrorOrnament({ className = "", size = 64 }: ErrorOrnamentProps): React.JSX.Element {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        animate={
          prefersReduced
            ? undefined
            : { rotate: [0, 3, 0, -3, 0] }
        }
        transition={
          prefersReduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <rect
          x="32"
          y="4"
          width="38"
          height="38"
          rx="4"
          transform="rotate(45 32 4)"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <motion.rect
          x="32"
          y="14"
          width="24"
          height="24"
          rx="3"
          transform="rotate(45 32 14)"
          stroke="var(--color-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          animate={
            prefersReduced
              ? undefined
              : { opacity: [0.3, 0.6, 0.3] }
          }
          transition={
            prefersReduced
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <line
          x1="10"
          y1="32"
          x2="54"
          y2="32"
          stroke="var(--color-gold)"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle cx="32" cy="32" r="3" fill="var(--color-gold)" opacity="0.8" />
        <motion.circle
          cx="32"
          cy="32"
          r="6"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.5"
          opacity="0.4"
          animate={
            prefersReduced
              ? undefined
              : { r: [6, 9, 6], opacity: [0.4, 0.1, 0.4] }
          }
          transition={
            prefersReduced
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.svg>
    </motion.div>
  )
}

export default ErrorOrnament
