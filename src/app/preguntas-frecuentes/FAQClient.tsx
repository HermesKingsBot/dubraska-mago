"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FAQHero from "@/components/faq/FAQHero"
import FAQSearch from "@/components/faq/FAQSearch"
import FAQList from "@/components/faq/FAQList"
import FAQCTA from "@/components/faq/FAQCTA"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FAQ_DATA = [
  {
    id: 1,
    question: "¿De qué material están hechas las piezas?",
    answer:
      "Todas nuestras piezas están hechas de acero inoxidable 316L bañado en oro 18K. Es un material hipogénico, resistente a la corrosión y perfecto para uso diario sin perder el brillo.",
  },
  {
    id: 2,
    question: "¿Las piezas se ponen negras o se despintan con el tiempo?",
    answer:
      "No. El baño en oro 18K de alta calidad mantiene su color y brillo durante años con los cuidados adecuados. Evitamos el contacto con químicos fuertes, perfumes y cloro para prolongar su vida útil.",
  },
  {
    id: 3,
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a toda Venezuela a través de MRW, Zoom y Domesa. El tiempo de entrega varía entre 2 a 7 días hábiles según la zona.",
  },
  {
    id: 4,
    question: "¿Cuánto cuesta el envío?",
    answer:
      "El costo del envío depende del destino y la agencia seleccionada. Los precios van desde $3 hasta $8 para envíos nacionales. Envíos gratis en compras superiores a $100.",
  },
  {
    id: 5,
    question: "¿Puedo devolver o cambiar una pieza?",
    answer:
      "Sí, aceptamos devoluciones dentro de los primeros 7 días posteriores a la recepción, siempre que la pieza esté sin usar y en su empaque original. Los cambios por talla o defecto son sin costo.",
  },
  {
    id: 6,
    question: "¿Ofrecen garantía en las piezas?",
    answer:
      "Todas nuestras piezas tienen garantía de 6 meses contra defectos de fabricación. Si presenta algún problema, te reponemos la pieza sin costo adicional.",
  },
  {
    id: 7,
    question: "¿Hacen piezas personalizadas?",
    answer:
      "¡Sí! Trabajamos con diseños personalizados. Envíanos tu idea o referencia y te enviamos una cotización en 24-48 horas. Perfecto para regalos especiales o piezas únicas.",
  },
  {
    id: 8,
    question: "¿Cómo cuido mis piezas para que duren más?",
    answer:
      "Guárdalas en su empaque original o en una bolsa suave. Evita contacto con agua salada, cloro, perfumes y cremas. Límpialas con un paño seco de microfibra después de cada uso.",
  },
  {
    id: 9,
    question: "¿Tienen tienda física o solo venden online?",
    answer:
      "Actualmente operamos 100% online, lo que nos permite ofrecer precios más competitivos sin sacrificar calidad. Puedes seguirnos en Instagram para ver nuestras piezas en vivo.",
  },
  {
    id: 10,
    question: "¿Cómo puedo hacer un pedido?",
    answer:
      "Puedes hacer tu pedido directamente por WhatsApp, Instagram o a través de nuestro catálogo online. Aceptamos pagos por transferencia, Zelle, PayPal o efectivo contra entrega (según zona).",
  },
]

export default function FAQClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroLineRef = useRef<HTMLDivElement>(null)
  const faqSectionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({})
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<
    Record<number, "up" | "down" | null>
  >({})

  const filteredFAQs = FAQ_DATA.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    )
  })

  const toggleItem = useCallback((id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleCopy = useCallback(async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleFeedback = useCallback((id: number, type: "up" | "down") => {
    setFeedback((prev) => {
      const current = prev[id]
      if (current === type) return { ...prev, [id]: null }
      return { ...prev, [id]: type }
    })
  }, [])

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
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
              }
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
            {
              scaleX: 1,
              duration: 1.2,
              delay: 0.8,
              ease: "power2.inOut",
            }
          )
        }

        if (faqSectionRef.current) {
          const items =
            faqSectionRef.current.querySelectorAll("[data-faq-item]")
          if (items.length) {
            gsap.fromTo(
              items,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: faqSectionRef.current,
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
            { opacity: 0, scale: 0.9 },
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
          faqSectionRef.current,
          ctaRef.current,
        ].filter(Boolean)
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
        })
        const heroH1 = heroRef.current?.querySelector("h1")
        const heroP = heroRef.current?.querySelector("p")
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 })
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 })
        if (heroLineRef.current)
          gsap.set(heroLineRef.current, { scaleX: 1 })
        const faqItems =
          faqSectionRef.current?.querySelectorAll("[data-faq-item]")
        faqItems?.forEach((item) => gsap.set(item, { opacity: 1, y: 0 }))
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <FAQHero ref={heroRef} heroLineRef={heroLineRef} />
      <FAQSearch ref={searchRef} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <section className="w-full px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <FAQList
            ref={faqSectionRef}
            filteredFAQs={filteredFAQs}
            searchQuery={searchQuery}
            openItems={openItems}
            copiedId={copiedId}
            feedback={feedback}
            onToggle={toggleItem}
            onCopy={handleCopy}
            onFeedback={handleFeedback}
          />
        </div>
      </section>
      <FAQCTA ref={ctaRef} />
    </div>
  )
}
