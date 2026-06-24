# TASK: Refactor Components — Function Declarations, OKLCH Colors, Tailwind v4

Refactor ALL components in the project to follow these 3 major changes.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (always apply)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments
- `export default ComponentName` at end
- 2-space indentation

---

## CHANGE 1: Convert ALL `const` components to `function` declarations with `React.JSX.Element` return type

Currently components use `const Component = forwardRef<Type, Props>(function Component(...))`.
Change to: `function Component(...): React.JSX.Element`

### Pattern to follow:

**BEFORE (const + forwardRef):**
```tsx
import { forwardRef } from "react"

interface NosotrosHeroProps {
  className?: string
}

const NosotrosHero = forwardRef<HTMLDivElement, NosotrosHeroProps>(function NosotrosHero(
  props,
  ref
) {
  return <section ref={ref}>...</section>
})

export default NosotrosHero
```

**AFTER (function + React.JSX.Element):**
```tsx
interface NosotrosHeroProps {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

function NosotrosHero(props: NosotrosHeroProps): React.JSX.Element {
  const { ref } = props
  return <section ref={ref}>...</section>
}

export default NosotrosHero
```

### Rules:
- If the component does NOT use `ref`, simply convert to `function ComponentName(props: Props): React.JSX.Element { ... }`
- If the component DOES use `ref`, add `ref?: React.Ref<HTMLDivElement>` to props interface and destructure it inside
- Remove ALL `forwardRef` imports
- Use `React.JSX.Element` as return type
- If the component uses `useGSAP` with a scope ref, that's fine — just don't use `forwardRef` for that purpose

### Special case: Components that use `useGSAP` with `scope` ref
If a component uses `useGSAP(() => {...}, { scope: sectionRef })`, and the ref is NOT passed from parent, just keep the ref as a local `useRef` inside the function. No need to add `ref` to props interface.

### Special case: Components that BOTH use `useGSAP` internally AND need `forwardRef`
If a parent component needs a ref to pass to a child, add `ref?: React.Ref<HTMLDivElement>` to props and destructure it. The ref can be used both by parent and by internal GSAP.

---

## CHANGE 2: Convert ALL hex colors to OKLCH

OKLCH is a modern perceptually-uniform color system. Convert all hardcoded hex colors in className or style props.

### Current brand colors → OKLCH equivalents:

| Name | Hex | OKLCH |
|------|-----|-------|
| Background | `#050505` | `oklch(0.13 0.005 60)` |
| Gold | `#D4AF37` | `oklch(0.78 0.14 85)` |
| Muted | `#8A8A8A` | `oklch(0.62 0.005 60)` |
| White | `#FFFFFF` | `oklch(1 0 0)` |
| Rose | `#E8B4B8` | `oklch(0.82 0.06 25)` |
| Black (dark card) | `#111111` | `oklch(0.18 0.003 60)` |
| Black (choker) | `#1a1a1a` | `oklch(0.21 0.003 60)` |

### How to use OKLCH in Tailwind v4:

In Tailwind v4, you can use arbitrary values with OKLCH:
```tsx
className="bg-[oklch(0.13_0.005_60)] text-[oklch(0.78_0.14_85)]"
```

Or define CSS variables in globals.css and reference them:
```css
:root {
  --color-bg: oklch(0.13 0.005 60);
  --color-gold: oklch(0.78 0.14 85);
  --color-muted: oklch(0.62 0.005 60);
  --color-white: oklch(1 0 0);
  --color-rose: oklch(0.82 0.06 25);
}
```

Then use: `className="bg-[var(--color-bg)]"` or better, define a Tailwind theme.

### IMPORTANT: Use CSS variables approach
1. Update `globals.css` `:root` to use OKLCH values
2. Replace ALL hardcoded hex in className/style props with `var(--color-*)` references
3. For colors that aren't in the brand palette (like black #111, #1a1a1a), use inline OKLCH: `oklch(0.18 0.003 60)` etc.

---

## CHANGE 3: Fix Tailwind v4 import in globals.css

Tailwind v4 uses a single import line. The current globals.css uses the v3 syntax.

### BEFORE:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### AFTER:
```css
@import "tailwindcss";
```

This is the ONLY correct way to import Tailwind v4.

---

## Files to Process

### Step 1: Fix globals.css
- Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
- Update `:root` colors from hex to OKLCH
- Keep the leaflet import at top

### Step 2: Fix ALL component files

Process EVERY `.tsx` file in `src/components/` and `src/app/`:

**Home components (11 files):**
- src/components/NavigationBar.tsx
- src/components/HeroSection.tsx
- src/components/VideoBackground.tsx
- src/components/AboutSection.tsx
- src/components/BestSellers.tsx
- src/components/CategoriesSection.tsx
- src/components/FeaturesSection.tsx
- src/components/ColorGuideSection.tsx
- src/components/TestimonialsSection.tsx
- src/components/Footer.tsx

**Catalog components (8 files):**
- src/components/catalog/ProductCard.tsx
- src/components/catalog/FiltersDrawer.tsx
- src/components/catalog/SearchBar.tsx
- src/components/catalog/Pagination.tsx
- src/components/catalog/LayoutToggle.tsx
- src/components/catalog/ProductGrid.tsx
- src/components/catalog/EmptyState.tsx

**Nosotros components (7 files):**
- src/components/nosotros/NosotrosHero.tsx
- src/components/nosotros/OriginStory.tsx
- src/components/nosotros/MissionValues.tsx
- src/components/nosotros/ProcessTimeline.tsx
- src/components/nosotros/StatsCounters.tsx
- src/components/nosotros/ValuesGrid.tsx
- src/components/nosotros/NosotrosCTA.tsx

**Politicas components (7 files):**
- src/components/politicas/PoliticasHero.tsx
- src/components/politicas/ReturnPolicy.tsx
- src/components/politicas/ExchangePolicy.tsx
- src/components/politicas/HygienePolicy.tsx
- src/components/politicas/ShippingDamage.tsx
- src/components/politicas/Refunds.tsx
- src/components/politicas/PoliticasCTA.tsx

**FAQ components (5 files):**
- src/components/faq/FAQHero.tsx
- src/components/faq/FAQSearch.tsx
- src/components/faq/FAQItem.tsx
- src/components/faq/FAQList.tsx
- src/components/faq/FAQCTA.tsx

**Product components (7 files):**
- src/components/product/ProductGallery.tsx
- src/components/product/ProductInfo.tsx
- src/components/product/ProductDescription.tsx
- src/components/product/ProductCTA.tsx
- src/components/product/CareInstructions.tsx
- src/components/product/ShippingReturns.tsx
- src/components/product/RelatedProducts.tsx

**Contact components (4 files):**
- src/components/contact/ContactHero.tsx
- src/components/contact/ContactCards.tsx
- src/components/contact/ContactForm.tsx
- src/components/contact/ContactCTA.tsx
- src/components/contact/ContactMap.tsx

**Page orchestrators (5 files):**
- src/app/colecciones/CatalogClient.tsx
- src/app/contacto/ContactClient.tsx
- src/app/nosotros/NosotrosClient.tsx
- src/app/preguntas-frecuentes/FAQClient.tsx
- src/app/politicas-cambios-devoluciones/PoliticasClient.tsx
- src/app/producto/[slug]/ProductDetailClient.tsx

**Page files (6 files):**
- src/app/page.tsx
- src/app/colecciones/page.tsx
- src/app/contacto/page.tsx
- src/app/nosotros/page.tsx
- src/app/preguntas-frecuentes/page.tsx
- src/app/politicas-cambios-devoluciones/page.tsx
- src/app/producto/[slug]/page.tsx

**Layout files (7 files):**
- src/app/layout.tsx
- src/app/colecciones/layout.tsx
- src/app/contacto/layout.tsx
- src/app/nosotros/layout.tsx
- src/app/preguntas-frecuentes/layout.tsx
- src/app/politicas-cambios-devoluciones/layout.tsx
- src/app/producto/[slug]/layout.tsx

---

## Steps

1. Fix `globals.css` — replace tailwind import, convert colors to OKLCH
2. Process ALL ~55 files: convert `const` → `function` with `React.JSX.Element`
3. Replace ALL hex colors (`#050505`, `#D4AF37`, `#8A8A8A`, `#FFFFFF`, `#E8B4B8`, `#111`, `#1a1a1a`) with `var(--color-*)` or OKLCH inline
4. Remove ALL `forwardRef` imports
5. Run `npm run build` to verify everything compiles
6. Fix any build errors
7. Do NOT deploy

## CRITICAL

- `React.JSX.Element` is the correct return type for function components in React 19 / Next.js 16
- Do NOT use `React.FC`, `React.ReactElement`, or `JSX.Element` — use `React.JSX.Element`
- Layout files and page files (Server Components) do NOT need `React.JSX.Element` return type annotation (they're simple)
- Only CLIENT components and UI components need the explicit return type
- When a component uses `useGSAP` with a local ref (not from parent), just use `useRef` normally — no `forwardRef` needed
