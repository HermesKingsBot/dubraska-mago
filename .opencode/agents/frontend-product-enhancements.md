# Frontend — Enhanced Product Page + Product Comparator

## Objective
1. **Enhanced Product Page**: Add size selector, customer reviews with star ratings, "Los clientes también compraron" section, countdown timer for offers
2. **Product Comparator**: Allow users to select 2-4 products and view them side-by-side with all specs

## Design System
- Dark Luxury: `var(--color-bg)`, `var(--color-gold)`, `var(--color-muted)`, `var(--color-white)`, `var(--color-dark-card)`, `var(--color-dark-accent)`
- Fonts: `var(--font-instrument-serif)` headings, `var(--font-inter)` body
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent, max 200 lines/file

## Part 1: Enhanced Product Page

### Update `src/components/product/ProductInfo.tsx`

Add size selector:
- If product has sizes, show size selector buttons
- Selected size highlighted in gold
- "Guía de tallas" link (modal with size guide)
- Show selected size in the CTA area

```typescript
// Add to ProductInfo:
const [selectedSize, setSelectedSize] = useState<string | null>(null)
const sizes = product.sizes ? JSON.parse(product.sizes) : []

// Size selector UI:
{sizes.length > 0 && (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-white" style={{ fontFamily: "var(--font-inter)" }}>
        Talla: {selectedSize || "Selecciona"}
      </span>
      <button className="text-xs text-[var(--color-gold)] underline">
        Guía de tallas
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`px-3 py-1.5 rounded border text-sm transition-colors ${
            selectedSize === size
              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
)}
```

### Create `src/components/product/SizeGuideModal.tsx`

Modal with size guide table:
- Anillos: cm equivalency chart
- Collares: length visualization
- Pulseras: wrist measurement guide
- Close button, click-outside to dismiss
- Framer Motion animate presence

### Create `src/components/product/ProductReviews.tsx`

Full reviews section:

```typescript
interface ProductReviewsProps {
  productId: string
  initialReviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}

// Sections:
// 1. Rating summary (left: big number, right: bar chart 5→1 stars)
// 2. "Escribir reseña" button → opens review form
// 3. Reviews list with: stars, name, date, title, comment, verified badge, helpful button
// 4. Pagination
```

**Sub-components:**
- `RatingStars.tsx` — Reusable star display (filled/half/empty)
- `RatingBar.tsx` — Single bar for distribution chart
- `ReviewCard.tsx` — Individual review display
- `ReviewForm.tsx` — Write a review form (name, email, rating, title, comment)
- `ReviewSuccess.tsx` — "Gracias por tu reseña" confirmation

### Create `src/components/product/OfferCountdown.tsx`

Countdown timer for products on sale:
- Shows "Oferta termina en: 2d 14h 30m"
- Animated flip or simple text
- Only shows if product has oldPrice
- Uses Framer Motion for pulse effect
- Auto-hides when expired

### Create `src/components/product/CustomersAlsoBought.tsx`

"Los clientes también compraron" section:
- Shows products from same category (already exists as RelatedProducts)
- Enhance with: "Comprados juntos frecuentemente" bundle suggestion
- Bundle discount: "Compra 2 y obtén 10% descuento"
- Add all to cart button

### Update `src/components/product/ProductCTA.tsx`

Pass selectedSize to WhatsApp message:
```typescript
const sizeText = selectedSize ? ` (Talla: ${selectedSize})` : ""
const encodedMsg = encodeURIComponent(
  `Hola! Me interesa ${product.name}${sizeText} - $${product.price.toFixed(2)}. ¿Está disponible?`
)
```

### Update `src/app/producto/[slug]/ProductDetailClient.tsx`

Integrate all new components:
- Add state for selectedSize
- Add ProductReviews section below related products
- Add OfferCountdown if product is on sale
- Pass selectedSize to ProductInfo and ProductCTA
- Fetch reviews from API on mount

## Part 2: Product Comparator

### Create `src/app/comparar/page.tsx` — Comparator Page

Main comparison page:
- Shows selected products side-by-side (2-4 columns)
- If no products: empty state with "Agrega productos para comparar"
- Comparison rows: Image, Name, Price, Material, Color, Dimensions, Weight, Rating, Stock, Sizes
- Highlight differences (rows where values differ get subtle highlight)
- "Eliminar" button per product
- "Agregar más" button → opens product picker
- Sticky header with product names
- Mobile: horizontal scroll or accordion view

### Create `src/components/compare/CompareBar.tsx`

Sticky bottom bar that appears when products are selected:
- Shows thumbnails of selected products (2-4)
- "Comparar (X)" button → links to /comparar
- "Limpiar todo" button
- Appears on catalog and product pages
- Framer Motion slide-up animation

### Create `src/components/compare/CompareProductCard.tsx`

Card in the comparison grid:
- Product image, name, price
- Remove button (X)
- Add to cart button
- WhatsApp CTA

### Create `src/components/compare/CompareTable.tsx`

The actual comparison table:
- Rows: Imagen, Nombre, Precio, Material, Color, Dimensiones, Peso, Valoración, Stock, Tallas
- Columns: one per product
- Highlight differing values
- Sticky first column (attribute names) on mobile scroll

### Create `src/components/compare/ProductPicker.tsx`

Modal to add products to comparison:
- Search products
- Grid of products with "Agregar" button
- Filter out already selected
- Max 4 products message

### Create `src/hooks/useCompare.ts`

Comparison state management:
- `compareIds: string[]`
- `addToCompare(productId)` — max 4
- `removeFromCompare(productId)`
- `clearCompare()`
- `isInCompare(productId): boolean`
- `compareCount: number`
- Persist to localStorage

### Create `src/context/CompareContext.tsx`

Provider wrapping the app (or at least catalog + product pages):
- Same pattern as CartContext/WishlistContext
- Persists to localStorage for guests

### Update `src/components/catalog/ProductCard.tsx`

Add compare checkbox:
- Small checkbox/icon on card (top-left or near heart)
- "Comparar" toggle
- If in compare: filled checkbox
- Tooltip: "Agregar al comparador"

### Update `src/components/NavigationBar.tsx`

Add compare icon with badge:
- Scales icon between cart and wishlist
- Badge shows count (1-4)
- Links to /comparar

### Create `src/components/compare/CompareEmptyState.tsx`

Empty state for /comparar when no products selected:
- Illustration/icon
- "Agrega productos para comparar"
- "Explorar catálogo" CTA
- Instructions: "Selecciona 2 o 4 productos del catálogo para comparar sus características"

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file — split into multiple components
- Use `'use client'` for interactive components
- GSAP for scroll animations, Framer Motion for UI transitions
- Respect `prefers-reduced-motion`
- All text in Spanish
- Mobile-first responsive

## Files to Read First
- `src/app/producto/[slug]/ProductDetailClient.tsx` — Current product page
- `src/components/product/ProductInfo.tsx` — Current product info
- `src/components/product/ProductCTA.tsx` — Current CTA
- `src/components/product/RelatedProducts.tsx` — Current related section
- `src/components/catalog/ProductCard.tsx` — Needs compare checkbox
- `src/components/NavigationBar.tsx` — Needs compare icon
- `src/context/CartContext.tsx` — Reference for context pattern
- `src/hooks/useApi.ts` — Reference for data fetching
- `src/types/product.ts` — Product types

## Verification
After all changes:
1. `npm run build` — must pass
2. Visit product page → see size selector, reviews section, countdown
3. Select size → WhatsApp message includes size
4. Write review → appears after page refresh (pending admin approval)
5. Add 2+ products to compare → /comparar shows side-by-side table
6. Compare bar appears on catalog when products selected
7. Mobile: all responsive
