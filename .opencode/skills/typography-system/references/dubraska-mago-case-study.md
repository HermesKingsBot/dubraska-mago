# Dubraska Mago — Typography Migration Case Study

## Before
- Display: Instrument Serif (400 only) — elegant but lacked weight variation
- Body: Inter (300-700) — functional but generic, too many weights loaded

## After
- Display: Playfair Display (400, 700) — high contrast, dramatic serifs, more luxury feel
- Body: DM Sans (300, 400, 500, 600) — geometric, premium, fewer weights = faster load

## Migration Steps
1. Update `src/app/layout.tsx` — swap font imports and variable names
2. Update `src/app/globals.css` — add typography scale in `@theme` block
3. Global `sed` replacement across all `.tsx` files:
   - `var(--font-instrument-serif)` → `var(--font-playfair)` (100+ occurrences)
   - `var(--font-inter)` → `var(--font-dm-sans)` (100+ occurrences)
4. Apply letter-spacing adjustments: -0.04em for titles, 0.1em for labels
5. Adjust line-height: 0.95-1.05 for display, 1.7-1.8 for body

## Files Changed
- 94 components updated
- 2 core files (layout.tsx, globals.css)
- Build passed with zero errors

## Key Learning
- Always use `display: "swap"` for web fonts (prevents FOIT)
- Load only needed weights (each weight = ~50-80KB)
- Use `variable` CSS properties for Tailwind v4 integration
- Global `sed` replacement is safe for font variable renames
- Test build after font changes (missing weights cause runtime errors)
