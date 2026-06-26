"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PrivacidadHero from "@/components/privacidad/PrivacidadHero"
import InfoRecopilada from "@/components/privacidad/InfoRecopilada"
import ComoUsamos from "@/components/privacidad/ComoUsamos"
import Proteccion from "@/components/privacidad/Proteccion"
import Cookies from "@/components/privacidad/Cookies"
import Derechos from "@/components/privacidad/Derechos"
import Terceros from "@/components/privacidad/Terceros"
import Retencion from "@/components/privacidad/Retencion"
import WebSegura from "@/components/privacidad/WebSegura"
import PrivacidadCTA from "@/components/privacidad/PrivacidadCTA"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function PrivacidadClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const usoRef = useRef<HTMLDivElement>(null)
  const proteccionRef = useRef<HTMLDivElement>(null)
  const cookiesRef = useRef<HTMLDivElement>(null)
  const derechosRef = useRef<HTMLDivElement>(null)
  const tercerosRef = useRef<HTMLDivElement>(null)
  const retencionRef = useRef<HTMLDivElement>(null)
  const webSeguraRef = useRef<HTMLDivElement>(null)
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

        const sections = [infoRef, usoRef, proteccionRef, cookiesRef, derechosRef, tercerosRef, retencionRef, webSeguraRef]
        sections.forEach((s) => {
          if (s.current) {
            gsap.fromTo(
              s.current,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: s.current,
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
          infoRef.current,
          usoRef.current,
          proteccionRef.current,
          cookiesRef.current,
          derechosRef.current,
          tercerosRef.current,
          retencionRef.current,
          webSeguraRef.current,
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
      <PrivacidadHero ref={heroRef} heroLineRef={heroLineRef} />
      <InfoRecopilada ref={infoRef} />
      <ComoUsamos ref={usoRef} />
      <Proteccion ref={proteccionRef} />
      <Cookies ref={cookiesRef} />
      <Derechos ref={derechosRef} />
      <Terceros ref={tercerosRef} />
      <Retencion ref={retencionRef} />
      <WebSegura ref={webSeguraRef} />
      <PrivacidadCTA ref={ctaRef} />

      <div className="px-6 pb-16 max-w-3xl mx-auto text-center">
        <p
          className="text-xs text-[var(--color-muted)] leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
        >
          Esta política de privacidad puede actualizarse periódicamente. Te notificaremos por email sobre cambios significativos en el manejo de tu información personal.
        </p>
      </div>
    </div>
  )
}
