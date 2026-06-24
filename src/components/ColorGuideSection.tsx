"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const COLORS = [
  {
    name: "Dorado",
    tagline: "El clásico que nunca falla",
    desc: "Perfecto si tu piel tiene tonos cálidos, morenos, canela o trigueños. El dorado resalta la calidez natural de tu piel y le da ese glow que todas queremos.",
    tip: "Si ves las venas de tu muñeca y se ven verdosas, ¡el dorado es tu color!",
    skinType: "Piel cálida, morena, trigueña",
    borderColor: "border-[#D4AF37]",
    bgAccent: "from-[#D4AF37]/15",
    textAccent: "text-[#D4AF37]",
    dotColor: "bg-[#D4AF37]",
    filter: "color=dorado",
  },
  {
    name: "Plateado",
    tagline: "Elegante y versátil",
    desc: "Ideal para pieles claras, rosadas o con subtonos fríos. El plateado da un look fresco y sofisticado que combina con todo.",
    tip: "Si las venas de tu muñeca se ven azuladas o moradas, el plateado te va a enamorar.",
    skinType: "Piel clara, rosada, subtono frío",
    borderColor: "border-[#B0B0B0]",
    bgAccent: "from-[#B0B0B0]/15",
    textAccent: "text-[#B0B0B0]",
    dotColor: "bg-[#B0B0B0]",
    filter: "color=plateado",
  },
  {
    name: "Rosé",
    tagline: "Romántico y femenino",
    desc: "El tono que mezcla lo mejor del dorado y el plateado. Se adapta a casi todos los tonos de piel y da un look delicado y moderno.",
    tip: "Perfecto si quieres algo diferente que igual combine con todo.",
    skinType: "Todos los tonos",
    borderColor: "border-[#E8B4B8]",
    bgAccent: "from-[#E8B4B8]/15",
    textAccent: "text-[#E8B4B8]",
    dotColor: "bg-[#E8B4B8]",
    filter: "color=rose",
  },
]

export default function ColorGuideSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const cards = cardsRef.current?.querySelectorAll(".color-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 50, opacity: 0, scale: 0.95 },
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
        const cards = cardsRef.current?.querySelectorAll(".color-card")
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { y: 35, opacity: 0 },
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
        const _cdc = cardsRef.current?.querySelectorAll(".color-card")
        if (_cdc) gsap.set(_cdc, { opacity: 1, y: 0, scale: 1 })
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
            Encuentra tu match
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[-2px]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Qué color va contigo?
          </h2>
          <p
            className="text-base sm:text-lg text-[#8A8A8A] mt-5 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Tu tono de piel tiene un compañero perfecto. Descúbrelo aquí.
          </p>
        </div>

        {/* Color Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
        >
          {COLORS.map((color) => (
            <a
              key={color.name}
              href={`/colecciones?${color.filter}`}
              className={`color-card group relative rounded-2xl overflow-hidden border ${color.borderColor}/20 hover:${color.borderColor}/50 transition-all duration-500`}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${color.bgAccent} via-transparent to-transparent opacity-50`} />

              <div className="relative p-6 pt-8 pb-8 flex flex-col">
                {/* Color dot */}
                <div className="mb-6 flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${color.dotColor} ring-2 ring-offset-2 ring-offset-[#050505] ${color.borderColor}/30`} />
                  <div className={`w-3 h-3 rounded-full ${color.dotColor} opacity-40`} />
                </div>

                {/* Name */}
                <h3
                  className="text-3xl sm:text-4xl text-white mb-2"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {color.name}
                </h3>

                {/* Tagline */}
                <p
                  className={`text-sm ${color.textAccent} mb-5`}
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                >
                  {color.tagline}
                </p>

                {/* Description */}
                <p
                  className="text-sm text-[#8A8A8A] leading-relaxed mb-5"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  {color.desc}
                </p>

                {/* Tip */}
                <p
                  className="text-xs text-[#B0B0B0] leading-relaxed mb-5 italic border-l-2 border-[rgba(212,175,55,0.15)] pl-3"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  {color.tip}
                </p>

                {/* Skin type badge */}
                <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.04)]">
                  <p
                    className="text-[10px] uppercase tracking-[2px] text-[#555]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    Piel ideal: {color.skinType}
                  </p>
                </div>

                {/* Arrow */}
                <div className={`absolute top-6 right-6 w-8 h-8 rounded-full border ${color.borderColor}/20 flex items-center justify-center group-hover:${color.borderColor}/50 transition-colors duration-300`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 group-hover:text-white/70 transition-colors duration-300">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p
            className="text-[#8A8A8A] text-base mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ¿No sabes cuál es tu subtono? No te preocupes.
          </p>
          <a
            href="https://wa.me/58XXXXXXXXXX?text=Hola%20Dubraska,%20%C2%BFme%20ayudas%20a%20elegir%20el%20color%20para%20mi%20tono%20de%20piel%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-medium border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Preguntar por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
