"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  oldPrice: number | null
  badge: string | null
  image: string | null
  color: string | null
  category: { name: string }
}

function formatPrice(price: number): string {
  return "Bs. " + price.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function AnimatedPrice({ price }: { price: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1200
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * price))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, price])

  return (
    <span ref={ref}>
      {formatPrice(displayed)}
    </span>
  )
}

export default function BestSellers({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const headerEls = sectionRef.current?.querySelectorAll(".bs-header")
        if (headerEls?.length) {
          gsap.fromTo(
            headerEls,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const cards = cardsRef.current?.querySelectorAll(".product-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 60, opacity: 0, scale: 0.95, rotateX: 3 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        const cta = sectionRef.current?.querySelector(".bs-cta")
        if (cta) {
          gsap.fromTo(
            cta,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cta,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(max-width: 767px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".product-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
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
        const _pc = cardsRef.current?.querySelectorAll(".product-card")
        if (_pc) gsap.set(_pc, { opacity: 1, y: 0, scale: 1 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  if (!products.length) return null

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--color-bg)] py-28 sm:py-36 md:py-44">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <p
            className="bs-header text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
          >
            Lo que todas quieren
          </p>
          <h2
            className="bs-header text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Nuestras piezas favoritas
          </h2>
          <p
            className="bs-header text-base sm:text-lg text-[var(--color-muted)] mt-5 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Las que se agotan primero. No te quedes sin la tuya.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.slug}`}
              className="product-card group relative flex flex-col"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-dark-card)]">
                {product.image ? (
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    whileInView={{ scale: [1, 1.05] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark-card)] via-[var(--color-dark-accent)] to-[var(--color-dark-card)]" />
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                {product.badge && (
                  <div className="absolute top-3 left-3 z-10 overflow-hidden">
                    <motion.span
                      className={`relative inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                        product.badge === "OFERTA"
                          ? "bg-[oklch(0.65_0.2_25)] text-white"
                          : product.badge === "NUEVO"
                          ? "bg-white text-[var(--color-bg)]"
                          : "bg-[var(--color-gold)] text-[var(--color-bg)]"
                      }`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {product.badge}
                      <motion.span
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.span>
                  </div>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`w-3 h-3 rounded-full border border-white/20 ${
                      product.color === "Dorado" || product.color === "dorado"
                        ? "bg-[var(--color-gold)]"
                        : product.color === "Plateado" || product.color === "plateado"
                        ? "bg-[oklch(0.76_0_0)]"
                        : "bg-[var(--color-rose)]"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col flex-1">
                <h3
                  className="text-sm sm:text-base text-white font-medium leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-xs text-[var(--color-muted)] mt-1.5 line-clamp-1"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                >
                  {product.description}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className="text-lg text-[var(--color-gold)]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {product.price ? <AnimatedPrice price={product.price} /> : "Consultar"}
                  </span>
                  {product.oldPrice && (
                    <span
                      className="text-xs text-[var(--color-muted)] line-through"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                <span
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[var(--color-gold)]/60 text-[var(--color-gold)] text-xs font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Ver detalles
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bs-cta text-center mt-12">
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-2 text-[var(--color-gold)] text-base font-medium hover:gap-3 transition-all duration-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ver todo el catálogo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
