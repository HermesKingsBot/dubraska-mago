# TASK: Code Cleanup — Remove Semicolons, Apply Code Rules

Refactor ALL existing code in the project to follow these strict rules. This applies to EVERY `.tsx` and `.ts` file in `src/`.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Rules to Apply (ALL files)

### 1. REMOVE ALL SEMICOLONS
Every `;` must be removed. Statements end with newlines.

```tsx
// BEFORE
const name = "Dubraska";
const price = 85;
return <div>{name}</div>;

// AFTER
const name = "Dubraska"
const price = 85
return <div>{name}</div>
```

### 2. DOUBLE QUOTES ONLY
Replace ALL single quotes (`'`) with double quotes (`"`). Template literals with interpolation are OK.

```tsx
// BEFORE
const title = 'Collar';
const path = '/producto';

// AFTER
const title = "Collar"
const path = "/producto"
```

### 3. REMOVE ALL COMMENTS
Delete every comment in the code:
- `// single line comments`
- `/* multi-line comments */`
- `{# ... #}` (if any)

No comments allowed. Code must be self-documenting.

### 4. EXPORT DEFAULT AT END
Every component file MUST end with `export default ComponentName` on its own line at the very end.

```tsx
// BEFORE
export default function ProductCard() {}

// AFTER
const ProductCard = ({ product }: ProductCardProps) => {
  return <div>...</div>
}

export default ProductCard
```

### 5. 2-SPACE INDENTATION
Ensure all files use exactly 2 spaces. No tabs, no 4 spaces.

## Files to Process

Process ALL these files (every `.tsx` and `.ts` in `src/`):

1. `src/app/layout.tsx`
2. `src/app/page.tsx`
3. `src/app/globals.css` (if it has comments)
4. `src/app/colecciones/layout.tsx`
5. `src/app/colecciones/page.tsx`
6. `src/app/colecciones/CatalogClient.tsx`
7. `src/app/contacto/layout.tsx`
8. `src/app/contacto/page.tsx`
9. `src/app/contacto/ContactClient.tsx`
10. `src/app/nosotros/layout.tsx`
11. `src/app/nosotros/page.tsx`
12. `src/app/nosotros/NosotrosClient.tsx`
13. `src/app/preguntas-frecuentes/layout.tsx`
14. `src/app/preguntas-frecuentes/page.tsx`
15. `src/app/preguntas-frecuentes/FAQClient.tsx`
16. `src/app/politicas-cambios-devoluciones/layout.tsx`
17. `src/app/politicas-cambios-devoluciones/page.tsx`
18. `src/app/politicas-cambios-devoluciones/PoliticasClient.tsx`
19. `src/app/producto/[slug]/layout.tsx`
20. `src/app/producto/[slug]/page.tsx`
21. `src/app/producto/[slug]/ProductDetailClient.tsx`
22. `src/components/NavigationBar.tsx`
23. `src/components/HeroSection.tsx`
24. `src/components/VideoBackground.tsx`
25. `src/components/AboutSection.tsx`
26. `src/components/BestSellers.tsx`
27. `src/components/CategoriesSection.tsx`
28. `src/components/FeaturesSection.tsx`
29. `src/components/ColorGuideSection.tsx`
30. `src/components/TestimonialsSection.tsx`
31. `src/components/Footer.tsx`
32. `src/components/catalog/ProductCard.tsx`
33. `src/components/catalog/FiltersDrawer.tsx`
34. `src/components/catalog/SearchBar.tsx`
35. `src/components/catalog/Pagination.tsx`
36. `src/components/catalog/LayoutToggle.tsx`
37. `src/components/catalog/ProductGrid.tsx`
38. `src/components/catalog/EmptyState.tsx`
39. `src/components/contact/ContactMap.tsx`
40. `src/types/product.ts`
41. `src/lib/catalog-utils.ts`

## Steps

1. Read each file
2. Remove ALL semicolons
3. Replace ALL single quotes with double quotes
4. Remove ALL comments
5. Ensure `export default ComponentName` is at the end of component files
6. Ensure 2-space indentation
7. Save the file

## CRITICAL: Process ALL 41 files

Do NOT skip any file. Every single file must be processed and cleaned.

## After Processing ALL Files

Run `npm run build` to verify everything still compiles correctly.

If build fails, fix the errors. Common issues:
- Missing semicolons in type annotations (NOT allowed — types don't need semicolons)
- Import statements without semicolons (correct)
- Object/interface definitions without semicolons (correct)

## Do NOT deploy

Just clean the code and verify build passes.