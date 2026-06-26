"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"
import { useSettingsContext } from "@/context/SettingsContext"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STORE_LINKS = [
  { label: "Collares", href: "/colecciones" },
  { label: "Pulseras", href: "/colecciones" },
  { label: "Aretes", href: "/colecciones" },
  { label: "Anillos", href: "/colecciones" },
  { label: "Sets completos", href: "/colecciones" },
  { label: "Más vendidos", href: "/colecciones" },
]

const INFO_LINKS = [
  { label: "Sobre mí", href: "/nosotros" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Envíos", href: "/envios" },
  { label: "Cambios y devoluciones", href: "/politicas-cambios-devoluciones" },
  { label: "Contacto", href: "/contacto" },
]

const SOCIAL_SVG: Record<string, { path: string; hoverClass: string }> = {
  WhatsApp: {
    hoverClass: "hover:border-[oklch(0.78_0.18_155)] hover:bg-[oklch(0.78_0.18_155)]/10",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  },
  Instagram: {
    hoverClass: "hover:border-[oklch(0.6_0.22_355)] hover:bg-[oklch(0.6_0.22_355)]/10",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  Facebook: {
    hoverClass: "hover:border-[oklch(0.6_0.22_250)] hover:bg-[oklch(0.6_0.22_250)]/10",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [showTop, setShowTop] = useState(false)
  const { getSetting, getActiveSocials } = useSettingsContext()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cols = footerRef.current?.querySelectorAll(".footer-col")
        if (cols?.length) {
          gsap.fromTo(
            cols,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const _fc = footerRef.current?.querySelectorAll(".footer-col")
        if (_fc) gsap.set(_fc, { opacity: 1, y: 0 })
      })

      return () => mm.revert()
    },
    { scope: footerRef }
  )

  useGSAP(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const companyName = getSetting("company_name", "Dubraska Mago")
  const slogan = getSetting("company_description")
  const phone = getSetting("whatsapp")
  const activeSocials = getActiveSocials()

  return (
    <footer ref={footerRef} className="relative w-full bg-[var(--color-bg)] border-t border-[rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto px-6 pt-24 sm:pt-32 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          <div className="footer-col col-span-2 md:col-span-1">
            <a
              href="/"
              className="text-2xl text-[var(--color-gold)] tracking-tight hover:text-[oklch(0.84_0.12_85)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {companyName.toUpperCase()}<sup className="text-[10px]">®</sup>
            </a>
            <p
              className="text-sm text-[var(--color-muted)] mt-4 leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {slogan || "Acero inoxidable bañado en oro 18K. Piezas diseñadas para mujeres que brillan con fuerza."}
            </p>
            <div className="flex gap-4 mt-6" role="list" aria-label="Redes sociales">
              {activeSocials.slice(0, 2).map((social) => {
                const svgData = SOCIAL_SVG[social.platform]
                if (!svgData) return null
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className={`w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center transition-all duration-300 ${svgData.hoverClass}`}
                    aria-label={`Visitar ${social.platform} (abre en nueva pestaña)`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-muted)" aria-hidden="true">
                      <path d={svgData.path} />
                    </svg>
                  </motion.a>
                )
              })}
              {activeSocials.length === 0 && phone && (
                <motion.a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-[oklch(0.78_0.18_155)] hover:bg-[oklch(0.78_0.18_155)]/10 transition-all duration-300"
                  aria-label="Contactar por WhatsApp (abre en nueva pestaña)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-muted)" aria-hidden="true">
                    <path d={SOCIAL_SVG.WhatsApp.path} />
                  </svg>
                </motion.a>
              )}
            </div>
          </div>

          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Tienda
            </h4>
            <ul className="space-y-3">
              {STORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group text-sm text-[var(--color-muted)] hover:text-white transition-all duration-300 inline-flex items-center hover:translate-x-1"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Información
            </h4>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group text-sm text-[var(--color-muted)] hover:text-white transition-all duration-300 inline-flex items-center hover:translate-x-1"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No te pierdas nada
            </h4>
            <p
              className="text-sm text-[var(--color-muted)] mb-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Sé la primera en conocer nuevos lanzamientos.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <label htmlFor="newsletter-email" className="text-xs uppercase tracking-[1px] text-[var(--color-muted)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Email
              </label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                aria-describedby="newsletter-hint"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-dark-accent)] border border-[rgba(255,255,255,0.08)] text-white text-sm placeholder:text-[oklch(0.45_0_0)] focus:border-[var(--color-gold)] focus:outline-none focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] transition-all duration-300"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold hover:brightness-110 transition-all duration-300"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Suscribirme
              </button>
            </form>
            <p id="newsletter-hint" className="text-[11px] text-[oklch(0.45_0_0)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Sin spam. Puedes cancelar cuando quieras. Al suscribirte aceptas nuestra <a href="/politicas-privacidad" className="hover:text-white transition-colors">política de privacidad</a>.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.04)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-[11px] text-[oklch(0.45_0_0)]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            © 2026 {companyName}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="/terminos"
              className="text-[11px] text-[var(--color-muted)] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Términos y condiciones
            </a>
            <a
              href="/politicas-privacidad"
              className="text-[11px] text-[var(--color-muted)] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Política de privacidad
            </a>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow"
        aria-label="Volver arriba"
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={showTop ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </motion.svg>
      </motion.button>
    </footer>
  )
}
