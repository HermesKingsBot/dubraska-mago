"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { motion, AnimatePresence } from "motion/react"
import products from "../../data/products.json"
import { CartButton, WishlistLink } from "@/components/CartIcon"
import UserMenu from "@/components/UserMenu"
import SearchOverlay from "@/components/SearchOverlay"
import { useSettingsContext } from "@/context/SettingsContext"
import CompareLink from "@/components/compare/CompareLink"

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  image: string
}

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Envíos", href: "/envios" },
  { label: "Contacto", href: "/contacto" },
]

function NavLink({ item }: { item: typeof NAV_ITEMS[number] }) {
  return (
    <a
      href={item.href}
      className="group relative text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-300 py-1"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {item.label}
      <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-gold)] group-hover:w-full transition-all duration-300 ease-out" />
    </a>
  )
}

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const { getSetting } = useSettingsContext()

  const companyName = getSetting("company_name", "Dubraska Mago")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useGSAP(() => {
    if (!headerRef.current) return
  }, { scope: headerRef })

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg)]/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 sm:px-8 sm:py-6 max-w-7xl mx-auto">
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-2xl md:text-3xl tracking-tight text-[var(--color-gold)] hover:text-[oklch(0.84_0.12_85)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {companyName.toUpperCase()}<sup className="text-xs">®</sup>
          </motion.a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openSearch}
              className="p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
              aria-label="Buscar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] hover:text-white transition-colors">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-1">
              <CompareLink />
              <CartButton />
              <WishlistLink />
            </div>

            <div className="hidden sm:block">
              <UserMenu />
            </div>

            <motion.a
              href="/colecciones"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex rounded-full px-6 py-2.5 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-bg)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden relative"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <span className="relative z-10">Catálogo</span>
              <motion.span
                className="absolute inset-0 z-20"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "100%", opacity: 0.3 }}
                transition={{ duration: 0.6 }}
                style={{
                  background: "linear-gradient(90deg, transparent, white, transparent)",
                }}
              />
            </motion.a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden border-t border-white/5 bg-[var(--color-bg)]/98 backdrop-blur-md"
            >
              <nav className="flex flex-col px-6 py-4 gap-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="py-3 text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex items-center gap-3 py-3">
                  <CompareLink />
                  <CartButton />
                  <WishlistLink />
                  <a href="/login" className="ml-auto text-sm text-[var(--color-gold)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Iniciar Sesión
                  </a>
                </div>
                <a
                  href="/colecciones"
                  className="mt-3 text-center rounded-full px-6 py-3 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-bg)]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Catálogo
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
    </>
  )
}
