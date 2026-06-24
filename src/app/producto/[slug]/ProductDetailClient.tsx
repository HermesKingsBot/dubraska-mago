"use client"

import { useState, useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Product } from "@/types/product"
import { buildWhatsAppLink } from "@/lib/catalog-utils"
import ProductGallery from "@/components/product/ProductGallery"
import ProductInfo from "@/components/product/ProductInfo"
import ProductDescription from "@/components/product/ProductDescription"
import ProductCTA from "@/components/product/ProductCTA"
import CareInstructions from "@/components/product/CareInstructions"
import ShippingReturns from "@/components/product/ShippingReturns"
import RelatedProducts from "@/components/product/RelatedProducts"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#8A8A8A]" style={{ fontFamily: "var(--font-inter)" }}>
          <a href="/" className="hover:text-white transition-colors">Inicio</a>
          <span>/</span>
          <a href="/colecciones" className="hover:text-white transition-colors">Catálogo</a>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery
            ref={mainImageRef}
            gallery={product.gallery}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            badge={product.badge}
            discount={discount}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            zoomRef={zoomRef}
          />

          <div className="flex flex-col">
            <ProductInfo
              ref={infoRef}
              product={product}
              discount={discount}
            />
            <ProductCTA
              ref={ctaRef}
              quantity={quantity}
              onQuantityChange={setQuantity}
              whatsappLink={whatsappLink}
              inStock={product.inStock}
            />
            <ProductDescription
              product={product}
              descOpen={descOpen}
              onToggleDesc={() => setDescOpen(!descOpen)}
            />
            <CareInstructions
              product={product}
              careOpen={careOpen}
              onToggleCare={() => setCareOpen(!careOpen)}
            />
          </div>
        </div>

        <ShippingReturns ref={shippingRef} />
        <RelatedProducts ref={relatedRef} relatedProducts={relatedProducts} />
      </div>
    </div>
  )
}
