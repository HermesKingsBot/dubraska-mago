"use client"

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import NosotrosHero from "@/components/nosotros/NosotrosHero"
import OriginStory from "@/components/nosotros/OriginStory"
import MissionValues from "@/components/nosotros/MissionValues"
import ProcessTimeline from "@/components/nosotros/ProcessTimeline"
import StatsCounters from "@/components/nosotros/StatsCounters"
import ValuesGrid from "@/components/nosotros/ValuesGrid"
import NosotrosCTA from "@/components/nosotros/NosotrosCTA"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function NosotrosClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const originLeftRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [counters, setCounters] = useState({ clientes: 0, piezas: 0, anos: 0 })

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

        if (originLeftRef.current) {
          gsap.fromTo(
            originLeftRef.current,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: originLeftRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        if (missionRef.current) {
          const cards = missionRef.current.querySelectorAll("[data-mission-card]")
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
                  trigger: missionRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (processRef.current) {
          const steps = processRef.current.querySelectorAll("[data-process-step]")
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
                  trigger: processRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
              const targets = { clientes: 500, piezas: 1000, anos: 3 }
              gsap.to(targets, {
                clientes: targets.clientes,
                piezas: targets.piezas,
                anos: targets.anos,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                  setCounters({
                    clientes: Math.round(targets.clientes),
                    piezas: Math.round(targets.piezas),
                    anos: Math.round(targets.anos),
                  })
                },
              })
            },
          })
        }

        if (valuesRef.current) {
          const items = valuesRef.current.querySelectorAll("[data-value-item]")
          if (items.length) {
            gsap.fromTo(
              items,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: valuesRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          }
        }

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
          originLeftRef.current,
          missionRef.current,
          processRef.current,
          statsRef.current,
          valuesRef.current,
          ctaRef.current,
        ].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroLineRef.current) gsap.set(heroLineRef.current, { scaleX: 1 })
        setCounters({ clientes: 500, piezas: 1000, anos: 3 })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <NosotrosHero ref={heroRef} heroLineRef={heroLineRef} />
      <OriginStory ref={originLeftRef} />
      <MissionValues ref={missionRef} />
      <ProcessTimeline ref={processRef} />
      <StatsCounters ref={statsRef} counters={counters} />
      <ValuesGrid ref={valuesRef} />
      <NosotrosCTA ref={ctaRef} />
    </div>
  )
}
