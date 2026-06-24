"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ContactHero from "@/components/contact/ContactHero"
import ContactCards from "@/components/contact/ContactCards"
import ContactForm from "@/components/contact/ContactForm"
import ContactCTA from "@/components/contact/ContactCTA"

gsap.registerPlugin(ScrollTrigger)

const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl border border-white/10 bg-[var(--color-dark-card)] flex items-center justify-center">
      <span className="text-[var(--color-muted)] text-sm">Cargando mapa...</span>
    </div>
  ),
})

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useGSAP(
    () => {
      if (!heroRef.current) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")

        if (heroH1) {
          gsap.fromTo(
            heroH1,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
          )
        }
        if (heroP) {
          gsap.fromTo(
            heroP,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
          )
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll("[data-card]")
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
              },
            }
          )
        }

        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
              },
            }
          )
        }

        if (mapRef.current) {
          gsap.fromTo(
            mapRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: mapRef.current,
                start: "top 80%",
              },
            }
          )
        }

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.8 },
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
        const allEls = [heroRef.current, cardsRef.current, formRef.current, mapRef.current, ctaRef.current].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1 })
      })
    },
    { scope: containerRef }
  )

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) e.name = "El nombre es obligatorio"
    if (!form.email.trim()) {
      e.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email inválido"
    }
    if (!form.subject) e.subject = "Selecciona un asunto"
    if (!form.message.trim()) e.message = "El mensaje es obligatorio"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) {
      setSubmitted(true)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div ref={containerRef} className="min-h-screen">
      <ContactHero ref={heroRef} />
      <ContactCards ref={cardsRef} />
      <ContactForm
        ref={formRef}
        form={form}
        submitted={submitted}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <section ref={mapRef} className="px-6 pb-20 md:pb-28 max-w-6xl mx-auto opacity-0">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-4"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Nuestra Ubicación
        </h2>
        <p
          className="text-center text-[var(--color-muted)] mb-10 text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Mercado La Isla, Caracas — Local 251
        </p>
        <ContactMap />
      </section>
      <ContactCTA ref={ctaRef} />
    </div>
  )
}
