# TASK: Refactor Large Pages into Smaller Components

Refactor the 5 largest page components (>500 lines each) into smaller, reusable components (max 150-200 lines per file). Each section of the page should become its own component file.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (MUST FOLLOW)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY (no single quotes)
- NO comments in code
- `export default ComponentName` at end of each file
- 2-space indentation

## Refactoring Plan

### 1. `src/app/nosotros/NosotrosClient.tsx` (841 lines → ~150 lines)

Current sections → Extract each into `src/components/nosotros/`:

| New Component | Section |
|---------------|---------|
| `src/components/nosotros/NosotrosHero.tsx` | Hero with "Nuestra Historia" headline |
| `src/components/nosotros/OriginStory.tsx` | Two-column brand origin story |
| `src/components/nosotros/MissionValues.tsx` | 3 cards: Misión, Visión, Filosofía |
| `src/components/nosotros/ProcessTimeline.tsx` | 4-step process timeline |
| `src/components/nosotros/StatsCounters.tsx` | 4 animated counters |
| `src/components/nosotros/ValuesGrid.tsx` | 6-card values grid |
| `src/components/nosotros/NosotrosCTA.tsx` | Final CTA banner |

Then `NosotrosClient.tsx` becomes the orchestrator that imports and renders all 7 components.

### 2. `src/app/politicas-cambios-devoluciones/PoliticasClient.tsx` (802 lines → ~150 lines)

| New Component | Section |
|---------------|---------|
| `src/components/politicas/PoliticasHero.tsx` | Hero section |
| `src/components/politicas/ReturnPolicy.tsx` | Devoluciones section |
| `src/components/politicas/ExchangePolicy.tsx` | Cambios section |
| `src/components/politicas/HygienePolicy.tsx` | Higiene aclaración (with rose accent) |
| `src/components/politicas/ShippingDamage.tsx` | Pieza rota por envío |
| `src/components/politicas/Refunds.tsx` | Reembolsos section |
| `src/components/politicas/PoliticasCTA.tsx` | Final CTA banner |

### 3. `src/app/preguntas-frecuentes/FAQClient.tsx` (787 lines → ~150 lines)

| New Component | Section |
|---------------|---------|
| `src/components/faq/FAQHero.tsx` | Hero section |
| `src/components/faq/FAQSearch.tsx` | Search bar with filtering |
| `src/components/faq/FAQItem.tsx` | Single accordion item (copy, thumbs) |
| `src/components/faq/FAQList.tsx` | List of FAQ items |
| `src/components/faq/FAQCTA.tsx` | Final CTA banner |

### 4. `src/app/producto/[slug]/ProductDetailClient.tsx` (636 lines → ~200 lines)

| New Component | Section |
|---------------|---------|
| `src/components/product/ProductGallery.tsx` | Image gallery with zoom + thumbnails |
| `src/components/product/ProductInfo.tsx` | Name, price, badge, material, dimensions |
| `src/components/product/ProductDescription.tsx` | Description + specs table |
| `src/components/product/ProductCTA.tsx` | Quantity selector + WhatsApp button |
| `src/components/product/CareInstructions.tsx` | Care instructions collapsible |
| `src/components/product/ShippingReturns.tsx` | 3 mini-cards (envío, devoluciones, garantía) |
| `src/components/product/RelatedProducts.tsx` | Related products grid |

### 5. `src/app/contacto/ContactClient.tsx` (619 lines → ~150 lines)

| New Component | Section |
|---------------|---------|
| `src/components/contact/ContactHero.tsx` | Hero section |
| `src/components/contact/ContactCards.tsx` | 4 premium contact cards |
| `src/components/contact/ContactForm.tsx` | Contact form |
| `src/components/contact/ContactCTA.tsx` | Final CTA banner |

Note: The map is already in `src/components/contact/ContactMap.tsx` — import it into ContactClient.

## Steps

For EACH of the 5 files:

1. Read the current file to understand all sections
2. Create the component files in the appropriate subdirectory
3. Move section code into each component
4. Keep types/interfaces that are shared in a local `types.ts` if needed
5. Rewrite the original page file to import and compose all components
6. Ensure props are passed correctly (shared state lifted to parent)
7. Run `npm run build` after EACH page to verify no breakage

## Important

- Create subdirectories: `src/components/nosotros/`, `src/components/politicas/`, `src/components/faq/`, `src/components/product/`, `src/components/contact/`
- Each component file must be MAX 200 lines
- The orchestrator (original file) must be MAX 250 lines
- Shared types/interfaces go in a `types.ts` in the same directory if needed
- GSAP animations stay in their respective component
- Props must be typed with interfaces
- Follow ALL code rules from the system prompt

## After ALL 5 Pages Refactored

Run `npm run build` one final time to confirm everything compiles.

Do NOT deploy — that is Hermes' job.