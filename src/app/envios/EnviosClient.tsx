"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroEnvios from "@/components/envios/HeroEnvios"
import TransportadorasCards from "@/components/envios/TransportadorasCards"
import EnvioDetalle from "@/components/envios/EnvioDetalle"
import CobroDestinoInfo from "@/components/envios/CobroDestinoInfo"
import BannerDevoluciones from "@/components/envios/BannerDevoluciones"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function EnviosClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const detalleRef = useRef<HTMLDivElement>(null)
  const cobroRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroRef.current) {
          const heroH1 = heroRef.current.querySelector("h1")
          const heroP = heroRef.current.querySelector("p")
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
        }

        if (heroLineRef.current) {
          gsap.fromTo(
            heroLineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, delay: 0.8, ease: "power2.inOut" }
          )
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll("[data-card]")
          if (cards.length) {
            gsap.fromTo(
              cards,
              { y: 50, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: cardsRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (detalleRef.current) {
          const steps = detalleRef.current.querySelectorAll("[data-step]")
          if (steps.length) {
            gsap.fromTo(
              steps,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: detalleRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (cobroRef.current) {
          gsap.fromTo(
            cobroRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cobroRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (bannerRef.current) {
          gsap.fromTo(
            bannerRef.current,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bannerRef.current,
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
          cardsRef.current,
          detalleRef.current,
          cobroRef.current,
          bannerRef.current,
        ].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroLineRef.current) gsap.set(heroLineRef.current, { scaleX: 1 })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <HeroEnvios ref={heroRef} heroLineRef={heroLineRef} />
      <TransportadorasCards ref={cardsRef} />
      <EnvioDetalle ref={detalleRef} />
      <CobroDestinoInfo ref={cobroRef} />
      <BannerDevoluciones ref={bannerRef} />
    </div>
  )
}
