"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Product, ProductVariant } from "@/types/product"
import { buildWhatsAppLink } from "@/lib/catalog-utils"
import ProductGallery from "@/components/product/ProductGallery"
import ProductInfo from "@/components/product/ProductInfo"
import ProductDescription from "@/components/product/ProductDescription"
import ProductCTA from "@/components/product/ProductCTA"
import CareInstructions from "@/components/product/CareInstructions"
import ShippingReturns from "@/components/product/ShippingReturns"
import RelatedProducts from "@/components/product/RelatedProducts"
import ProductReviews from "@/components/product/ProductReviews"
import OfferCountdown from "@/components/product/OfferCountdown"
import CustomersAlsoBought from "@/components/product/CustomersAlsoBought"
import VariantColorSelector from "@/components/product/VariantColorSelector"
import VariantSizeSelector from "@/components/product/VariantSizeSelector"
import { useSettingsContext } from "@/context/SettingsContext"

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

function getDisplayPrice(
  product: Product,
  selectedVariant: ProductVariant | null
): number {
  if (selectedVariant && selectedVariant.price !== null) {
    return selectedVariant.price
  }
  return product.price ?? 0
}

function getDisplayOldPrice(
  product: Product,
  selectedVariant: ProductVariant | null
): number | null {
  if (selectedVariant && selectedVariant.oldPrice !== null) {
    return selectedVariant.oldPrice
  }
  return product.oldPrice ?? null
}

function getDisplayImage(
  product: Product,
  selectedVariant: ProductVariant | null
): string {
  if (selectedVariant && selectedVariant.image) {
    return selectedVariant.image
  }
  return product.image || ""
}

function getDisplayGallery(
  product: Product,
  selectedVariant: ProductVariant | null
): string[] {
  if (selectedVariant && selectedVariant.gallery && selectedVariant.gallery.length > 0) {
    return selectedVariant.gallery
  }
  return product.variants?.[0]?.gallery ?? []
}

function getDisplayStock(
  product: Product,
  selectedVariant: ProductVariant | null
): boolean {
  if (selectedVariant) {
    return selectedVariant.inStock
  }
  return product.inStock ?? false
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [descOpen, setDescOpen] = useState(true)
  const [careOpen, setCareOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewSummary, setReviewSummary] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: {} as Record<number, number>,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const alsoBoughtRef = useRef<HTMLDivElement>(null)

  const { getSetting } = useSettingsContext()

  const hasVariants = product.hasVariants && product.variants && product.variants.length > 0
  const variants = product.variants || []

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  )

  const selectedColor = selectedVariant?.color || null

  const displayPrice = getDisplayPrice(product, selectedVariant)
  const displayOldPrice = getDisplayOldPrice(product, selectedVariant)
  const displayImage = getDisplayImage(product, selectedVariant)
  const displayGallery = getDisplayGallery(product, selectedVariant)
  const displayInStock = getDisplayStock(product, selectedVariant)

  useEffect(() => {
    if (hasVariants && variants.length > 0 && !selectedVariantId) {
      const firstActive = variants.find((v) => v.active && v.inStock)
      if (firstActive) {
        setSelectedVariantId(firstActive.id)
        if (firstActive.size) setSelectedSize(firstActive.size)
      }
    }
  }, [hasVariants, variants, selectedVariantId])

  useEffect(() => {
    setSelectedImage(0)
  }, [selectedVariantId])

  const handleSelectVariant = useCallback(
    (variantId: string) => {
      setSelectedVariantId(variantId)
      const v = variants.find((vr) => vr.id === variantId)
      if (v?.size) setSelectedSize(v.size)
    },
    [variants]
  )

  const handleSelectSize = useCallback(
    (size: string) => {
      setSelectedSize(size)
      if (hasVariants && selectedColor) {
        const match = variants.find(
          (v) => v.color === selectedColor && v.size === size && v.active
        )
        if (match) setSelectedVariantId(match.id)
      }
    },
    [hasVariants, selectedColor, variants]
  )

  const discount = displayOldPrice
    ? Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100)
    : null

  const variantInfo =
    selectedVariant && hasVariants
      ? [selectedVariant.color, selectedVariant.size].filter(Boolean).join(" / ")
      : ""

  const sizeText = variantInfo
    ? ` (${variantInfo})`
    : selectedSize
      ? ` (Talla: ${selectedSize})`
      : ""
  const encodedMsg = encodeURIComponent(
    `Hola! Me interesa ${product.name}${sizeText} - $${displayPrice.toFixed(2)}. ¿Está disponible?`
  )
  const whatsappLink = `https://wa.me/${getSetting("whatsapp", "584141234567")}?text=${encodedMsg}`

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

    if (reviewsRef.current) {
      gsap.fromTo(
        reviewsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 85%",
          },
        }
      )
    }

    if (alsoBoughtRef.current) {
      gsap.fromTo(
        alsoBoughtRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: alsoBoughtRef.current,
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

  const variantProduct = {
    ...product,
    price: displayPrice,
    oldPrice: displayOldPrice,
    image: displayImage,
    gallery: displayGallery,
    inStock: displayInStock,
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
          <a href="/" className="hover:text-white transition-colors">Inicio</a>
          <span>/</span>
          <a href="/colecciones" className="hover:text-white transition-colors">Catálogo</a>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6">
          <OfferCountdown oldPrice={displayOldPrice} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery
            ref={mainImageRef}
            gallery={displayGallery}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            badge={product.badge}
            discount={discount}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            zoomRef={zoomRef}
          />

          <div className="flex flex-col">
            <div ref={infoRef}>
              {hasVariants && (
                <div className="mb-4 space-y-3">
                  <VariantColorSelector
                    variants={variants}
                    selectedVariantId={selectedVariantId}
                    onSelectVariant={handleSelectVariant}
                  />
                  <VariantSizeSelector
                    variants={variants}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    onSelectSize={handleSelectSize}
                  />
                </div>
              )}
              <ProductInfo
                product={variantProduct as any}
                discount={discount}
                selectedSize={selectedSize}
                onSizeChange={handleSelectSize}
              />
            </div>
            <ProductCTA
              ref={ctaRef}
              quantity={quantity}
              onQuantityChange={setQuantity}
              whatsappLink={whatsappLink}
              inStock={displayInStock}
              selectedSize={selectedSize}
            />
            <ProductDescription
              product={variantProduct as any}
              descOpen={descOpen}
              onToggleDesc={() => setDescOpen(!descOpen)}
            />
            <CareInstructions
              product={variantProduct as any}
              careOpen={careOpen}
              onToggleCare={() => setCareOpen(!careOpen)}
            />
          </div>
        </div>

        <ShippingReturns ref={shippingRef} />

        <div ref={reviewsRef}>
          <ProductReviews
            productId={product.id}
            initialReviews={reviews}
            averageRating={reviewSummary.averageRating}
            totalReviews={reviewSummary.total}
            ratingDistribution={reviewSummary.ratingDistribution}
          />
        </div>

        <RelatedProducts ref={relatedRef} relatedProducts={relatedProducts} />

        <div ref={alsoBoughtRef}>
          <CustomersAlsoBought products={relatedProducts} />
        </div>
      </div>
    </div>
  )
}
