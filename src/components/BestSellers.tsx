"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PRODUCTS = [
  {
    name: "Collar Cadena Dorado",
    desc: "Acero inoxidable bañado en oro 18K",
    price: "Bs. 85,00",
    badge: "SÚPER VENDIDO",
    color: "dorado",
  },
  {
    name: "Pulsera Eslabones",
    desc: "Acero inoxidable bañado en oro 18K",
    price: "Bs. 65,00",
    badge: "NUEVO",
    color: "dorado",
  },
  {
    name: "Aretes Argolla Grande",
    desc: "Acero inoxidable bañado en oro 18K",
    price: "Bs. 45,00",
    badge: "SÚPER VENDIDO",
    color: "plateado",
  },
  {
    name: "Set Collar + Pulsera",
    desc: "Acero inoxidable bañado en oro 18K",
    price: "Bs. 130,00",
    oldPrice: "Bs. 150,00",
    badge: "OFERTA",
    color: "dorado",
  },
]

export default function BestSellers() {
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
              ease: "power2.out",
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
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
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

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--color-bg)] py-28 sm:py-36 md:py-44">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <p
            className="bs-header text-[11px] uppercase tracking-[3px] text-[var(--color-gold)] mb-5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Lo que todas quieren
          </p>
          <h2
            className="bs-header text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Nuestras piezas favoritas
          </h2>
          <p
            className="bs-header text-base sm:text-lg text-[var(--color-muted)] mt-5 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Las que se agotan primero. No te quedes sin la tuya.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="product-card group relative flex flex-col"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-dark-card)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark-card)] via-[var(--color-dark-accent)] to-[var(--color-dark-card)]" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-[var(--color-gold)]/10 flex items-center justify-center group-hover:border-[var(--color-gold)]/25 transition-colors duration-500">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeWidth="0.6"
                      opacity="0.25"
                    >
                      {product.name.includes("Collar") && (
                        <path d="M6 8a6 6 0 0 1 12 0c0 6-3 10-6 14-3-4-6-8-6-14z" />
                      )}
                      {product.name.includes("Pulsera") && (
                        <ellipse cx="12" cy="12" rx="8" ry="5" />
                      )}
                      {product.name.includes("Aretes") && (
                        <>
                          <circle cx="8" cy="14" r="3" />
                          <circle cx="16" cy="14" r="3" />
                        </>
                      )}
                      {product.name.includes("Set") && (
                        <>
                          <path d="M6 8a6 6 0 0 1 12 0c0 6-3 10-6 14-3-4-6-8-6-14z" />
                          <ellipse cx="12" cy="18" rx="5" ry="3" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="absolute inset-0 bg-[var(--color-gold)]/0 group-hover:bg-[var(--color-gold)]/5 transition-colors duration-500" />

                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                        product.badge === "OFERTA"
                          ? "bg-[oklch(0.65_0.2_25)] text-white"
                          : product.badge === "NUEVO"
                          ? "bg-white text-[var(--color-bg)]"
                          : "bg-[var(--color-gold)] text-[var(--color-bg)]"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`w-3 h-3 rounded-full border border-white/20 ${
                      product.color === "dorado"
                        ? "bg-[var(--color-gold)]"
                        : product.color === "plateado"
                        ? "bg-[oklch(0.76_0_0)]"
                        : "bg-[var(--color-rose)]"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col flex-1">
                <h3
                  className="text-sm sm:text-base text-white font-medium leading-tight"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-xs text-[var(--color-muted)] mt-1.5"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  {product.desc}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className="text-lg text-[var(--color-gold)]"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    {product.price}
                  </span>
                  {product.oldPrice && (
                    <span
                      className="text-xs text-[var(--color-muted)] line-through"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {product.oldPrice}
                    </span>
                  )}
                </div>

                <a
                  href={`https://wa.me/58XXXXXXXXXX?text=Hola%20Dubraska,%20me%20interesa%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[var(--color-gold)]/60 text-[var(--color-gold)] text-xs font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Comprar
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bs-cta text-center mt-12">
          <a
            href="/colecciones"
            className="inline-flex items-center gap-2 text-[var(--color-gold)] text-base font-medium hover:gap-3 transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ver todo el catálogo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
