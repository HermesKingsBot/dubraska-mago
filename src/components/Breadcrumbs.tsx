"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    )
  }, { scope: containerRef })

  return (
    <nav
      ref={containerRef}
      className="flex items-center gap-2 text-xs overflow-x-auto"
      style={{ fontFamily: "var(--font-dm-sans)" }}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-2 whitespace-nowrap">
            {index > 0 && (
              <span className="text-[var(--color-muted)]/40 select-none">/</span>
            )}
            {isLast || !item.href ? (
              <span className="text-[var(--color-gold)]">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-[var(--color-muted)] hover:text-white hover:translate-x-0.5 transition-all duration-200"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
