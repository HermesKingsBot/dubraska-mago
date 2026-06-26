"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface EmptyStatesProps {
  variant: "empty-cart" | "empty-wishlist" | "empty-search" | "empty-orders"
  onAction?: () => void
}

const CONFIG = {
  "empty-cart": {
    title: "Tu carrito está vacío",
    description: "Explora nuestras colecciones y encuentra piezas únicas que enamoran.",
    cta: "Explorar catálogo",
    href: "/colecciones",
  },
  "empty-wishlist": {
    title: "Tu wishlist está vacía",
    description: "Guarda tus favoritos para no olvidar las piezas que más te gustan.",
    cta: "Descubrir colecciones",
    href: "/colecciones",
  },
  "empty-search": {
    title: "Sin resultados",
    description: "No encontramos lo que buscas. Intenta con otros términos o explora nuestros filtros.",
    cta: "Limpiar búsqueda",
    href: "/colecciones",
  },
  "empty-orders": {
    title: "Aún no tienes pedidos",
    description: "Cuando hagas tu primera compra, tus pedidos aparecerán aquí.",
    cta: "Comenzar a comprar",
    href: "/colecciones",
  },
}

function CartIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="var(--color-gold)" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="28" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.1" />
      <path d="M28 24L24 20V18C24 16.9 24.9 16 26 16H30L34 20H54C55.1 20 56 20.9 56 22L52 38C51.9 38.9 51.1 39.6 50.2 39.6H31.8C30.9 39.6 30.1 38.9 30 38L28 24Z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="33" cy="46" r="3" stroke="var(--color-gold)" strokeWidth="1.5" />
      <circle cx="49" cy="46" r="3" stroke="var(--color-gold)" strokeWidth="1.5" />
      <path d="M26 46H22V50C22 52.2 23.8 54 26 54H50C52.2 54 54 52.2 54 50V46" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="30" x2="40" y2="34" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="32" x2="42" y2="32" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function WishlistIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="var(--color-gold)" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="28" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.1" />
      <path d="M40 62L35.5 57.8C27 50.2 20 43.9 20 36.2C20 30 24.8 25.2 31 25.2C34.4 25.2 37.7 26.8 40 29.2C42.3 26.8 45.6 25.2 49 25.2C55.2 25.2 60 30 60 36.2C60 43.9 53 50.2 44.5 57.8L40 62Z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="40" y1="36" x2="40" y2="44" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="40" x2="44" y2="40" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="var(--color-gold)" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="28" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.1" />
      <circle cx="36" cy="36" r="12" stroke="var(--color-gold)" strokeWidth="1.5" />
      <line x1="44.5" y1="44.5" x2="54" y2="54" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="36" x2="40" y2="36" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function OrdersIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" stroke="var(--color-gold)" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="28" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.1" />
      <rect x="22" y="18" width="36" height="44" rx="3" stroke="var(--color-gold)" strokeWidth="1.5" />
      <line x1="28" y1="28" x2="52" y2="28" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
      <line x1="28" y1="36" x2="46" y2="36" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
      <line x1="28" y1="44" x2="50" y2="44" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="30" cy="28" r="1.5" fill="var(--color-gold)" opacity="0.4" />
      <circle cx="30" cy="36" r="1.5" fill="var(--color-gold)" opacity="0.4" />
      <circle cx="30" cy="44" r="1.5" fill="var(--color-gold)" opacity="0.4" />
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, React.FC> = {
  "empty-cart": CartIllustration,
  "empty-wishlist": WishlistIllustration,
  "empty-search": SearchIllustration,
  "empty-orders": OrdersIllustration,
}

export default function EmptyStates({ variant, onAction }: EmptyStatesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const config = CONFIG[variant]
  const Illustration = ILLUSTRATIONS[variant]

  useGSAP(() => {
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    const tl = gsap.timeline()
    tl.fromTo(
      containerRef.current.querySelector(".empty-illustration"),
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        containerRef.current.querySelector(".empty-title"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        containerRef.current.querySelector(".empty-desc"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.35"
      )
      .fromTo(
        containerRef.current.querySelector(".empty-cta"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.35"
      )
  }, { scope: containerRef })

  const content = (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="empty-illustration mb-8 opacity-0">
        <Illustration />
      </div>

      <h3
        className="empty-title text-white text-xl sm:text-2xl mb-3 opacity-0"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {config.title}
      </h3>

      <p
        className="empty-desc text-[var(--color-muted)] text-sm sm:text-base max-w-md mb-8 leading-relaxed opacity-0"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {config.description}
      </p>

      {onAction ? (
        <button
          onClick={onAction}
          className="empty-cta relative overflow-hidden px-8 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold tracking-wide hover:brightness-110 transition-all opacity-0 group"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <span className="relative z-10">{config.cta}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </button>
      ) : (
        <Link
          href={config.href}
          className="empty-cta relative overflow-hidden px-8 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold tracking-wide hover:brightness-110 transition-all opacity-0 group"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <span className="relative z-10">{config.cta}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </Link>
      )}
    </div>
  )

  return content
}
