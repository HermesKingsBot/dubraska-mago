# Next.js Layout Patterns & Gotchas

## Video Background — 0x0 Dimensions Bug

**Problem:** `<video>` or `<div>` with `absolute inset-0` inside `<main className="min-h-screen">`
renders with 0×0 dimensions. The video is invisible or collapsed.

**Root cause:** `min-h-screen` on a flex/grid child doesn't give an explicit `height`
to `absolute inset-0` children — they have no reference height to resolve against.

**Fix:** Use `h-screen` (explicit height) instead of `min-h-screen` on the
container that wraps absolute-positioned children:

```tsx
// ❌ Broken — absolute child gets 0×0
<main className="min-h-screen">
  <video className="absolute inset-0 w-full h-full object-cover" />
  <div className="relative z-10">...</div>
</main>

// ✅ Fixed — absolute child gets explicit viewport height
<main className="h-screen">
  <video className="absolute inset-0 w-full h-full object-cover" />
  <div className="relative z-10">...</div>
</main>
```

**When to use which:**
- `h-screen` — when you have `absolute inset-0` children (video bg, overlays)
- `min-h-screen` — when content determines height naturally (scrolling pages)

## Full-Page Scroll Layout (Multiple Sections)

When building a full scroll page (not single-screen), remove `h-screen` from
the outer container and let sections stack naturally:

```tsx
// app/layout.tsx or page.tsx
<main>  {/* No h-screen — let content flow */}
  <NavigationBar />
  <HeroSection />      {/* h-screen for viewport-filling hero */}
  <AboutSection />
  <BestSellers />
  <Footer />
</main>
```

Each section that needs viewport height uses its own `h-screen` or
`min-h-screen` independently.

## GSAP + Next.js Integration

- Import `gsap` and `ScrollTrigger` inside `useEffect` (client-only)
- Register plugins: `gsap.registerPlugin(ScrollTrigger)`
- Use `gsap.context()` for automatic cleanup on unmount
- Use `gsap.matchMedia()` for responsive animation differentiation
- Always respect `prefers-reduced-motion`:

```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  gsap.to(el, { y: 0, opacity: 1, duration: 1 });
}
```

## Vercel Deploy Notes

- Vercel CLI requires explicit `--token` or `VERCEL_TOKEN` env var
- Wrapper script pattern: `/opt/data/scripts/vercel.sh` handles auth + deploy
- Always specify `--workdir` for monorepo or non-root projects
- Verify deployment visually after each deploy (screenshot or browser check)
- **Token expiry**: If `npx vercel` returns "The specified token is not valid",
  regenerate at https://vercel.com/account/tokens and update `.env.vercel`.
  The wrapper script pattern (`source .env.vercel && npx vercel --token "$VERCEL_TOKEN"`)
  still works once the token is valid — no need to re-login via `vercel login`.
- **Build command**: `npm run build` (or `next build`). Next.js 16 uses Turbopack
  by default — builds are fast (~24s for a full site).
- **Deploy command**: `vercel --prod --yes` for production. The `--yes` flag
  skips confirmation prompts in CI/automation contexts.
