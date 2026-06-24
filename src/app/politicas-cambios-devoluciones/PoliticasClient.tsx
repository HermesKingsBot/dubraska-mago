"use client"

import { useRef, useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PoliticasHero from "@/components/politicas/PoliticasHero"
import ReturnPolicy from "@/components/politicas/ReturnPolicy"
import ExchangePolicy from "@/components/politicas/ExchangePolicy"
import HygienePolicy from "@/components/politicas/HygienePolicy"
import ShippingDamage from "@/components/politicas/ShippingDamage"
import Refunds from "@/components/politicas/Refunds"
import PoliticasCTA from "@/components/politicas/PoliticasCTA"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function PoliticasClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const devolucionesRef = useRef<HTMLDivElement>(null)
  const cambiosRef = useRef<HTMLDivElement>(null)
  const higieneRef = useRef<HTMLDivElement>(null)
  const daniosRef = useRef<HTMLDivElement>(null)
  const reembolsosRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroRef.current) {
          const heroH1 = heroRef.current.querySelector("h1")
          const heroP = heroRef.current.querySelector("p")
          const heroBadge = heroRef.current.querySelector("[data-badge]")

          if (heroH1) {
            gsap.fromTo(
              heroH1,
              { opacity: 0, y: 60, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }
            )
          }
          if (heroP) {
            gsap.fromTo(
              heroP,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" }
            )
          }
          if (heroBadge) {
            gsap.fromTo(
              heroBadge,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power3.out" }
            )
          }
        }

        if (heroLineRef.current) {
          gsap.fromTo(
            heroLineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, delay: 0.6, ease: "power2.inOut" }
          )
        }

        const sections = [devolucionesRef, cambiosRef, higieneRef, daniosRef, reembolsosRef]
        sections.forEach((ref) => {
          if (ref.current) {
            gsap.fromTo(
              ref.current,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        })

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = [
          heroRef.current,
          heroLineRef.current,
          devolucionesRef.current,
          cambiosRef.current,
          higieneRef.current,
          daniosRef.current,
          reembolsosRef.current,
          ctaRef.current,
        ].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        const heroBadge = heroRef.current?.querySelector("[data-badge]")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroBadge) gsap.set(heroBadge, { opacity: 1, y: 0 })
        if (heroLineRef.current) gsap.set(heroLineRef.current, { scaleX: 1 })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <PoliticasHero ref={heroRef} heroLineRef={heroLineRef} />
      <ReturnPolicy ref={devolucionesRef} />
      <ExchangePolicy ref={cambiosRef} />
      <HygienePolicy ref={higieneRef} />
      <ShippingDamage ref={daniosRef} />
      <Refunds ref={reembolsosRef} />
      <PoliticasCTA ref={ctaRef} />
    </div>
  )
}
