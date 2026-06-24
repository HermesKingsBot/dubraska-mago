"use client"

import { useRef, useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = [0.25, 0.46, 0.45, 0.94] as const

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

  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([])

  useEffect(() => {
    const p = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }))
    setParticles(p)
  }, [])

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
      {/* ===== SECTION 1: HERO ===== */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-44 md:pb-28"
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] opacity-0"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Políticas de{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Cambios y Devoluciones
          </span>
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed text-[#8A8A8A] opacity-0"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Tu satisfacción y confianza son nuestra prioridad
        </p>
        <div
          ref={heroLineRef}
          className="mt-8 w-20 h-[1px] bg-[#D4AF37] origin-center"
        />
        <div
          data-badge
          className="mt-6 inline-block rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A] px-4 py-1.5 text-xs text-[#8A8A8A] tracking-wide opacity-0"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
        >
          Última actualización: Junio 2026
        </div>
      </section>

      {/* ===== SECTION 2: POLÍTICA DE DEVOLUCIONES ===== */}
      <section
        ref={devolucionesRef}
        className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#0A0A0A] p-8 sm:p-10 md:p-14">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14l-4-4 4-4" />
                  <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Política de Devoluciones
              </h2>
            </div>

            <div className="space-y-10">
              {/* Plazo */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Plazo de Devolución
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Tienes <span className="text-white font-medium">7 días calendario</span> desde la recepción del producto para solicitar un cambio o devolución.
                </p>
              </div>

              {/* Condiciones */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Condiciones
                </h3>
                <ul className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    La pieza debe estar sin usar, sin marcas de uso, en su empaque original y con todas las etiquetas intactas.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    El producto debe venir con el mismo empaque de entrega (bolsa de terciopelo, caja, etc.).
                  </li>
                </ul>
              </div>

              {/* Cómo solicitar */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  ¿Cómo solicitar una devolución?
                </h3>
                <ol className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['1'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#050505] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Envía un mensaje a nuestro WhatsApp con tu número de pedido y el motivo.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['2'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#050505] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Te enviaremos la dirección de envío y las instrucciones.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['3'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#050505] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Una vez recibida la pieza y verificado su estado, procesamos el reembolso en 3-5 días hábiles.
                  </li>
                </ol>
              </div>

              {/* Costos envío */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Costos de envío de devolución
                </h3>
                <ul className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Si la devolución es por defecto nuestro: <span className="text-white font-medium">nosotros cubrimos el envío</span>.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Si es por cambio de opinión: <span className="text-white font-medium">el cliente cubre el costo de envío de retorno</span>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: POLÍTICA DE CAMBIOS ===== */}
      <section
        ref={cambiosRef}
        className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
        style={{ background: "#0A0A0A" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#050505]/80 p-8 sm:p-10 md:p-14">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Política de Cambios
              </h2>
            </div>

            <div className="space-y-10">
              {/* Defecto */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Cambio por defecto de fabricación
                </h3>
                <ul className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Si tu pieza llega con un defecto de fabricación (no por uso), <span className="text-white font-medium">te la cambiamos sin costo</span>.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Debes reportarlo dentro de las primeras <span className="text-white font-medium">48 horas</span> después de recibir el producto.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Envía fotos o video del defecto a nuestro WhatsApp.
                  </li>
                </ul>
              </div>

              {/* Talla o modelo */}
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Cambio por talla o modelo
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-4"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Si necesitas una talla diferente o quieres cambiar por otro modelo:
                </p>
                <ul className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Tienes <span className="text-white font-medium">7 días</span> para solicitarlo.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    La pieza debe estar en condiciones originales.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    El cliente cubre el envío de retorno; <span className="text-white font-medium">nosotros cubrimos el envío de la nueva pieza</span>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: HIGIENE — ACLARACIÓN IMPORTANTE ===== */}
      <section
        ref={higieneRef}
        className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[rgba(232,180,184,0.25)] bg-[#0A0A0A] p-8 sm:p-10 md:p-14 relative overflow-hidden">
            {/* Subtle accent background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "radial-gradient(ellipse at top right, rgba(232,180,184,0.04) 0%, rgba(5,5,5,0) 70%)",
              }}
            />

            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,180,184,0.3)] bg-[#050505]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Higiene — Aclaración Importante
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#E8B4B8] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Sobre cambios por higiene (Aretes, Zarcillos y Piercings)
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Por motivos de <span className="text-white font-medium">higiene y salud</span>, <span className="text-[#E8B4B8] font-medium">no aceptamos devoluciones ni cambios de aretes, zarcillos, piercings o cualquier pieza que se introduzca en la oreja o cuerpo</span>.
                </p>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mt-3"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Una vez abiertos o usados, estos artículos no pueden ser revendidos ni reutilizados por razones sanitarias.
                </p>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#050505]/80 p-6">
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-[#D4AF37] font-medium">Excepción:</span> Si la pieza llega defectuosa de fábrica (cierre roto, pieza torcida, etc.), sí procede el cambio sin costo. Debe reportarse en las primeras 48 horas con fotos.
                </p>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#0A0A0A] p-6">
                <h4
                  className="text-base sm:text-lg text-[#D4AF37] mb-3"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Recomendación
                </h4>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Revisa bien la pieza al recibirla. Si tienes alguna duda sobre el modelo o tamaño, contáctanos antes de usarla.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: DAÑOS POR ENVÍO ===== */}
      <section
        ref={daniosRef}
        className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
        style={{ background: "#0A0A0A" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#050505]/80 p-8 sm:p-10 md:p-14 relative overflow-hidden">
            {/* Subtle gold accent background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, rgba(5,5,5,0) 70%)",
              }}
            />

            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                ¿Qué pasa si mi pieza llega rota por el envío?
              </h2>
            </div>

            <div className="space-y-10">
              <div>
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Daños durante el envío
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-4"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Si tu paquete llega visiblemente dañado en el exterior (caja aplastada, rota, mojada):
                </p>
                <ol className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['1'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    <span className="text-white font-medium">No lo recibas</span> o documenta el daño con fotos/video en el momento de la entrega.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['2'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    <span className="text-white font-medium">Contáctanos inmediatamente</span> por WhatsApp con fotos del empaque y la pieza.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-6 relative before:content-['3'] before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:rounded-full before:border before:border-[rgba(212,175,55,0.3)] before:bg-[#0A0A0A] before:flex before:items-center before:justify-center before:text-[10px] before:text-[#D4AF37] before:font-medium"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    <span className="text-white font-medium">Nos haremos cargo al 100%</span> — te enviaremos una pieza nueva sin costo o te reembolsaremos completamente.
                  </li>
                </ol>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#0A0A0A] p-6">
                <h4
                  className="text-base sm:text-lg text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Proceso para piezas dañadas
                </h4>
                <ul className="space-y-3">
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Envía evidencia fotográfica dentro de las primeras <span className="text-white font-medium">24 horas</span>.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Verificamos el caso (puede tomar 1-2 días hábiles).
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Te enviamos un reemplazo o procesamos el reembolso completo.
                  </li>
                  <li
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#D4AF37]/50"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    <span className="text-white font-medium">No necesitas devolver la pieza dañada</span> — quédate como evidencia.
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#050505]/60 p-6">
                <h4
                  className="text-base sm:text-lg text-[#D4AF37] mb-3"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Nuestra promesa
                </h4>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Cada pieza sale de nuestro taller con empaque protector diseñado para el transporte. Si llega dañada, es responsabilidad del transportista y nosotros respondemos por ti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: REEMBOLSOS ===== */}
      <section
        ref={reembolsosRef}
        className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[#0A0A0A] p-8 sm:p-10 md:p-14">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[#050505]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Reembolsos
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#050505]/60 p-6">
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Métodos de reembolso
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Transferencia bancaria", "Zelle", "PayPal"].map((method) => (
                    <span
                      key={method}
                      className="inline-block rounded-full border border-[rgba(212,175,55,0.2)] bg-[#0A0A0A] px-4 py-2 text-sm text-[#B0B0B0]"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#050505]/60 p-6">
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Tiempo de procesamiento
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  <span className="text-white font-medium">3-5 días hábiles</span> después de aprobar la devolución.
                </p>
              </div>

              <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[#050505]/60 p-6">
                <h3
                  className="text-lg sm:text-xl text-[#D4AF37] mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  ¿Qué se reembolsa?
                </h3>
                <p
                  className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  El reembolso incluye el precio del producto (no el envío original, a menos que el error sea nuestro).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: CTA BANNER ===== */}
      <section ref={ctaRef} className="relative overflow-hidden px-6 py-24 md:py-32 opacity-0">
        {/* Radial gold gradient pulse */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0) 70%)",
          }}
        />

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/30 pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-${p.id % 5} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <style jsx>{`
          @keyframes float-0 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -30px); }
          }
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-15px, -25px); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(25px, -15px); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -35px); }
          }
          @keyframes float-4 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -20px); }
          }
        `}</style>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] mb-6"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Necesitas{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ayuda
            </span>{" "}
            con tu pedido?
          </h2>
          <p
            className="text-base sm:text-lg text-[#8A8A8A] mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Nuestro equipo está listo para resolver cualquier duda sobre cambios o devoluciones
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/584141234567?text=Hola,%20necesito%20ayuda%20con%20un%20cambio%20o%20devolución"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
              style={{
                fontFamily: "var(--font-inter)",
                background: "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
                color: "#050505",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium tracking-wide border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 cursor-pointer"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Ver Preguntas Frecuentes
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
