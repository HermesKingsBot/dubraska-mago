"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CATEGORIES = [
  {
    name: "Collares",
    count: "12 piezas",
    gradient: "from-[#D4AF37]/20 via-[#1a1a1a] to-[#0a0a0a]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.4">
        <path d="M6 8a6 6 0 0 1 12 0c0 6-3 10-6 14-3-4-6-8-6-14z" />
      </svg>
    ),
  },
  {
    name: "Pulseras",
    count: "8 piezas",
    gradient: "from-[#E8B4B8]/20 via-[#1a1a1a] to-[#0a0a0a]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.4">
        <ellipse cx="12" cy="12" rx="9" ry="5" />
      </svg>
    ),
  },
  {
    name: "Aretes",
    count: "15 piezas",
    gradient: "from-[#B0B0B0]/20 via-[#1a1a1a] to-[#0a0a0a]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.4">
        <circle cx="8" cy="14" r="3" />
        <circle cx="16" cy="14" r="3" />
      </svg>
    ),
  },
]

export default function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".cat-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 60, opacity: 0, scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(max-width: 767px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".cat-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const _cc = cardsRef.current?.querySelectorAll(".cat-card")
        if (_cc) gsap.set(_cc, { opacity: 1, y: 0, scale: 1 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative w-full bg-[#050505] py-28 sm:py-36 md:py-44">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <p
            className="text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Descubre
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Encuentra tu estilo
          </h2>
        </div>

        {/* Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
        >
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={`/colecciones/${cat.name.toLowerCase()}`}
              className="cat-card group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background gradient placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient}`} />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-[#050505]/20 transition-colors duration-500" />

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }} />

              {/* Icon centered */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  {cat.icon}
                </div>
              </div>

              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.08)] group-hover:border-[rgba(212,175,55,0.25)] transition-colors duration-500" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl text-white group-hover:text-[#D4AF37] transition-colors duration-300"
                      style={{ fontFamily: "var(--font-instrument-serif)" }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className="text-xs text-[#8A8A8A] mt-1"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cat.count}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[rgba(212,175,55,0.2)] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="group-hover:stroke-[#050505] transition-colors duration-300">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/[0.03] transition-colors duration-500 -z-10" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
