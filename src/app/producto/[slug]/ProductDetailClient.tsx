"use client"

import { useState, useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Product } from "@/types/product"
import ProductCard from "@/components/catalog/ProductCard"
import { buildWhatsAppLink } from "@/lib/catalog-utils"

gsap.registerPlugin(ScrollTrigger)

interface ProductDetailProps {
  product: Product & {
    gallery: string[]
    waterResistant: boolean
    details: string
    careInstructions: string
    dimensions: string
    relatedIds: string[]
  }
  relatedProducts: Product[]
}

const COLOR_MAP: Record<string, string> = {
  dorado: "#D4AF37",
  plateado: "#C0C0C0",
  rose: "#E8B4B8",
  negro: "#1a1a1a",
}

const GALLERY_LABELS = [
  "Vista principal",
  "Detalle de material",
  "Visto en persona",
  "Referencia de tamaño",
]

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [descOpen, setDescOpen] = useState(true)
  const [careOpen, setCareOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  const whatsappUrl = buildWhatsAppLink(product)
  const encodedMsg = encodeURIComponent(
    `Hola! Me interesa ${product.name} - $${product.price.toFixed(2)}. ¿Está disponible?`
  )
  const whatsappLink = `https://wa.me/584141234567?text=${encodedMsg}`

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!zoomRef.current || !mainImageRef.current) return
      const rect = mainImageRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      zoomRef.current.style.opacity = "1"
      zoomRef.current.style.transform = "scale(1.5)"
      zoomRef.current.style.transformOrigin = `${x}% ${y}%`
    },
    []
  )

  const handleImageMouseLeave = useCallback(() => {
    if (!zoomRef.current) return
    zoomRef.current.style.opacity = "0"
    zoomRef.current.style.transform = "scale(1)"
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      if (mainImageRef.current) {
        gsap.fromTo(
          mainImageRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
        )
      }
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.7, delay: 0.15, ease: "power2.out" }
        )
      }
    })

    mm.add("(max-width: 767px)", () => {
      if (mainImageRef.current) {
        gsap.fromTo(
          mainImageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
      }
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power2.out" }
        )
      }
    })

    if (shippingRef.current) {
      gsap.fromTo(
        shippingRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: shippingRef.current,
            start: "top 85%",
          },
        }
      )
    }

    if (relatedRef.current) {
      gsap.fromTo(
        relatedRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: relatedRef.current,
            start: "top 85%",
          },
        }
      )
    }

    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#8A8A8A]" style={{ fontFamily: "var(--font-inter)" }}>
          <a href="/" className="hover:text-white transition-colors">Inicio</a>
          <span>/</span>
          <a href="/colecciones" className="hover:text-white transition-colors">Catálogo</a>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Section 1: Image Gallery with Zoom */}
          <div ref={mainImageRef}>
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-crosshair"
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#050505]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#8A8A8A] block" style={{ fontFamily: "var(--font-inter)" }}>
                    {GALLERY_LABELS[selectedImage]}
                  </span>
                </div>
              </div>
              {/* Zoom lens overlay */}
              <div
                ref={zoomRef}
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none transition-opacity duration-200"
                style={{ opacity: 0 }}
              />
              {/* Badge */}
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded ${
                    product.badge === "OFERTA"
                      ? "bg-red-500/90 text-white"
                      : product.badge === "NUEVO"
                      ? "bg-[#D4AF37] text-[#050505]"
                      : product.badge === "LIMITADO"
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-[#D4AF37]/90 text-[#050505]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {product.badge}
                </span>
              )}
              {/* Discount badge */}
              {discount && (
                <span
                  className="absolute top-4 right-4 px-3 py-1.5 text-[11px] font-bold bg-red-500 text-white rounded"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {product.gallery.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-full aspect-square max-w-[100px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#050505]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] text-[#8A8A8A] text-center px-1" style={{ fontFamily: "var(--font-inter)" }}>
                      {GALLERY_LABELS[i]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2 + 4: Product Info + CTA (Right side desktop) */}
          <div ref={infoRef} className="flex flex-col">
            {/* Category */}
            <span
              className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.category}
            </span>

            {/* Product Name */}
            <h1
              className="text-3xl sm:text-4xl text-white mb-2 leading-tight"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-2xl sm:text-3xl text-[#D4AF37] font-semibold"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <>
                  <span
                    className="text-lg text-[#8A8A8A] line-through"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    ${product.oldPrice.toFixed(2)}
                  </span>
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Color + Material */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: COLOR_MAP[product.color] }}
                />
                <span
                  className="text-sm text-[#8A8A8A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm text-[#8A8A8A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {product.material}
                </span>
              </div>
            </div>

            {/* Dimensions */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#8A8A8A]" style={{ fontFamily: "var(--font-inter)" }}>
              {product.dimensions && (
                <span>Medidas: {product.dimensions}</span>
              )}
              {product.weight && <span>Peso: {product.weight}</span>}
            </div>

            {/* Water Resistant */}
            {product.waterResistant && (
              <div className="flex items-center gap-2 mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-xs text-[#D4AF37]" style={{ fontFamily: "var(--font-inter)" }}>
                  Resistente al agua
                </span>
              </div>
            )}

            {/* Section 4: Add to Cart / CTA */}
            <div ref={ctaRef} className="flex flex-col gap-4 p-6 rounded-xl bg-[#0a0a0a] border border-white/5">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#8A8A8A]" style={{ fontFamily: "var(--font-inter)" }}>
                  Cantidad
                </span>
                <div className="flex items-center border border-white/10 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 transition-colors rounded-l-lg"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    -
                  </button>
                  <span
                    className="w-12 h-10 flex items-center justify-center text-white border-x border-white/10"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 transition-colors rounded-r-lg"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#c9a432] text-[#050505] font-semibold text-sm hover:from-[#c9a432] hover:to-[#b8942a] transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className="text-xs text-[#8A8A8A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {product.inStock ? "Disponible" : "Agotado"}
                </span>
              </div>
            </div>

            {/* Section 3: Description & Details */}
            <div className="mt-6">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="flex items-center justify-between w-full py-3 border-b border-white/10"
              >
                <span
                  className="text-sm font-medium text-white"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Descripción
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-[#8A8A8A] transition-transform duration-200 ${descOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {descOpen && (
                <div className="py-4">
                  <p
                    className="text-sm text-[#8A8A8A] leading-relaxed mb-4"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {product.description}
                  </p>
                  <p
                    className="text-sm text-[#8A8A8A] leading-relaxed mb-6"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {product.details}
                  </p>
                  {/* Specs table */}
                  <div className="border border-white/5 rounded-lg overflow-hidden">
                    <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                      <tbody>
                        {(
                          [
                            ["Material", product.material],
                            ["Medidas", product.dimensions],
                            product.weight ? ["Peso", product.weight] : null,
                            ["Resistencia al agua", product.waterResistant ? "Sí" : "No"],
                            ["Categoría", product.category.charAt(0).toUpperCase() + product.category.slice(1)],
                            ["Color", product.color.charAt(0).toUpperCase() + product.color.slice(1)],
                            ["Garantía", "6 meses"],
                          ] as [string, string][]
                        )
                          .filter((item): item is [string, string] => item !== null)
                          .map(([label, value], i) => (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                            >
                              <td className="px-4 py-2.5 text-[#8A8A8A] border-r border-white/5">
                                {label}
                              </td>
                              <td className="px-4 py-2.5 text-white">{value}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Care Instructions */}
            <div className="mt-2">
              <button
                onClick={() => setCareOpen(!careOpen)}
                className="flex items-center justify-between w-full py-3 border-b border-white/10"
              >
                <span
                  className="text-sm font-medium text-white"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Cuidados
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-[#8A8A8A] transition-transform duration-200 ${careOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {careOpen && (
                <div className="py-4">
                  <div className="flex items-start gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      className="mt-0.5 shrink-0"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <p
                      className="text-sm text-[#8A8A8A] leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {product.careInstructions}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2 ml-8">
                    {[
                      "Evita contacto con agua salada y cloro",
                      "No apliques perfumes o cremas directamente",
                      "Guarda en su empaque o bolsa suave",
                      "Limpia con paño de microfibra",
                    ].map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-[#8A8A8A]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Shipping & Returns Info */}
        <div ref={shippingRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              ),
              title: "Envío gratis",
              desc: "En compras superiores a $100",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              ),
              title: "Devoluciones",
              desc: "7 días para devolver tu compra",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Garantía",
              desc: "6 meses de garantía",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl bg-[#0a0a0a] border border-white/5"
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-xs text-[#8A8A8A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 7: Related Products */}
        {relatedProducts.length > 0 && (
          <div ref={relatedRef} className="mt-20">
            <h2
              className="text-2xl sm:text-3xl text-white mb-8"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              También te puede <em className="text-[#D4AF37]">gustar</em>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((rp, i) => (
                <ProductCard key={rp.id} product={rp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
