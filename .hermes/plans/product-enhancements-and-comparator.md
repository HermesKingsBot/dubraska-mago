# Product Enhancements + Comparator Plan

## Part 1: Enhanced Product Page

### 1.1 Update `src/types/product.ts` — Add `sizes` to Product type
- Add `sizes?: string` (JSON string) to Product interface

### 1.2 Create `src/components/product/SizeGuideModal.tsx`
- Modal with size guide table (anillos, collares, pulseras)
- Close button, click-outside dismiss, Framer Motion animate

### 1.3 Update `src/components/product/ProductInfo.tsx`
- Add `selectedSize` and `onSizeChange` props
- Parse `product.sizes` JSON string → render size selector buttons
- Gold highlight for selected size, "Guía de tallas" button opens SizeGuideModal

### 1.4 Create `src/components/product/OfferCountdown.tsx`
- Countdown timer for products with oldPrice
- Shows "Oferta termina en: Xd Xh Xm"
- Framer Motion pulse, auto-hide when expired

### 1.5 Create `src/components/product/ProductReviews.tsx`
- Rating summary (big number + bar chart)
- "Escribir reseña" button
- Reviews list with stars, name, date, verified badge
- Sub-components: RatingStars, RatingBar, ReviewCard, ReviewForm, ReviewSuccess

### 1.6 Create `src/components/product/CustomersAlsoBought.tsx`
- "Los clientes también compraron" section
- "Compra 2 y obtén 10% descuento" bundle suggestion

### 1.7 Update `src/components/product/ProductCTA.tsx`
- Accept `selectedSize` prop, include in WhatsApp message

### 1.8 Update `src/app/producto/[slug]/ProductDetailClient.tsx`
- Add `selectedSize` state
- Render SizeGuideModal, OfferCountdown, ProductReviews, CustomersAlsoBought
- Pass selectedSize to ProductInfo and ProductCTA
- Build WhatsApp link with size

## Part 2: Product Comparator

### 2.1 Create `src/context/CompareContext.tsx`
- Same pattern as CartContext
- `compareIds: string[]`, `addToCompare`, `removeFromCompare`, `clearCompare`, `isInCompare`
- Persist to localStorage, max 4 products

### 2.2 Update `src/app/layout.tsx`
- Wrap with CompareProvider

### 2.3 Create `src/components/compare/CompareBar.tsx`
- Sticky bottom bar with thumbnails + "Comparar (X)" button
- Framer Motion slide-up, links to /comparar

### 2.4 Create `src/components/compare/CompareEmptyState.tsx`
- Empty state for /comparar page

### 2.5 Create `src/components/compare/CompareTable.tsx`
- Side-by-side comparison table (2-4 columns)
- Rows: Image, Name, Price, Material, Color, Dimensions, Weight, Rating, Stock, Sizes
- Highlight differing values, sticky first column

### 2.6 Create `src/app/comparar/page.tsx`
- Main comparison page using CompareTable

### 2.7 Update `src/components/catalog/ProductCard.tsx`
- Add compare toggle checkbox/icon
- Use CompareContext

### 2.8 Update `src/components/NavigationBar.tsx`
- Add compare icon with badge between cart and wishlist

## Files Summary

**New files (10):**
- src/components/product/SizeGuideModal.tsx
- src/components/product/OfferCountdown.tsx
- src/components/product/ProductReviews.tsx
- src/components/product/CustomersAlsoBought.tsx
- src/context/CompareContext.tsx
- src/components/compare/CompareBar.tsx
- src/components/compare/CompareEmptyState.tsx
- src/components/compare/CompareTable.tsx
- src/app/comparar/page.tsx

**Modified files (6):**
- src/types/product.ts
- src/components/product/ProductInfo.tsx
- src/components/product/ProductCTA.tsx
- src/app/producto/[slug]/ProductDetailClient.tsx
- src/components/catalog/ProductCard.tsx
- src/components/NavigationBar.tsx
- src/app/layout.tsx
