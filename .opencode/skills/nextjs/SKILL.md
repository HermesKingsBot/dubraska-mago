---
name: nextjs
description: "Next.js 15+ App Router: Server Components, Server Actions, caching, streaming, Partial Prerendering, route handlers, middleware, and performance optimization. Use for any Next.js development task."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [nextjs, react, app-router, server-components, server-actions, streaming, caching, ppR, typescript, fullstack]
    related_skills: [deployment, debugging, gsap]
---

# Next.js 15+ — App Router & Full-Stack Patterns

Comprehensive guide for Next.js 15+ with App Router, React 19, and TypeScript.

## When to Use

| Task | Section |
|------|---------|
| App Router file conventions | §1 File Conventions |
| Server vs Client Components | §2 Component Model |
| Data fetching & caching | §3 Data Fetching |
| Server Actions | §4 Server Actions |
| Streaming & Suspense | §5 Streaming |
| Partial Prerendering (PPR) | §6 PPR |
| Route Handlers & Middleware | §7 Routing |
| Performance optimization | §8 Performance |
| Common errors & debugging | §9 Pitfalls |

---

## §1 — App Router File Conventions

```
app/
├── layout.tsx          # Shared UI (Server Component by default)
├── page.tsx            # Route page (Server Component by default)
├── loading.tsx         # Suspense boundary (auto-wrapped)
├── error.tsx           # Error boundary (Client Component)
├── not-found.tsx       # 404 UI
├── template.tsx        # Re-mounting layout (like layout but re-animates)
├── default.tsx         # Parallel route fallback
├── route.ts            # API route handler
├── actions.ts          # Server Actions module
├── (marketing)/        # Route group (no URL segment)
├── @modal/             # Parallel route (named slot)
├── [...slug]/          # Catch-all segment
├── [[...slug]]/        # Optional catch-all
└── dashboard/
    ├── layout.tsx      # Nested layout
    └── settings/
        └── page.tsx
```

**Key rules:**
- `page.tsx` makes a segment publicly accessible
- `layout.tsx` wraps child layouts/pages (persists across navigations)
- `template.tsx` re-mounts on navigation (use for animations/reset state)
- Route groups `(folder)` organize without affecting URL
- Parallel routes `@slot` enable simultaneous rendering of multiple pages

---

## §2 — Server vs Client Components

### Server Components (default)
```tsx
// app/users/page.tsx — Server Component by default
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany(); // Direct DB access
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Client Components
```tsx
// app/components/counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Composition pattern (recommended)
```tsx
// Server Component wrapping Client Component
import Counter from './components/counter'; // Client
import { db } from '@/lib/db';

export default async function Page() {
  const data = await db.stats.findFirst();
  return (
    <div>
      <h1>{data.title}</h1>        {/* Server-rendered */}
      <Counter initial={data.count} /> {/* Client-interactive */}
    </div>
  );
}
```

**Rules:**
- `'use client'` directive at the top of the file
- Pass Server Component as `children` prop to avoid client boundary leakage
- Keep leaf components client, keep container components server
- Never pass non-serializable data (functions, class instances) to Server Components

---

## §3 — Data Fetching & Caching

### Fetch caching (Next.js extends fetch)
```tsx
// Static (default) — cached forever
const data = await fetch('https://api.example.com/posts', {
  cache: 'force-cache' // default behavior
});

// Dynamic — no cache
const data = await fetch('https://api.example.com/posts', {
  cache: 'no-store'
});

// Revalidate — ISR (Incremental Static Regeneration)
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 } // 1 hour
});
```

### Route segment config
```tsx
// app/posts/page.tsx
export const dynamic = 'force-dynamic';    // Opt out of static rendering
export const revalidate = 60;              // ISR: revalidate every 60s
export const fetchCache = 'force-no-store'; // All fetches in this route
export const runtime = 'edge';             // Edge runtime
export const preferredRegion = 'iad1';     // Deploy to specific region
```

### unstable_cache for fine-grained control
```ts
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id: string) => {
    return await db.user.findUnique({ where: { id } });
  },
  ['user'], // cache key
  {
    revalidate: 3600,
    tags: ['user'], // for on-demand revalidation
  }
);
```

### On-demand revalidation
```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, now: Date.now() });
  }
  return Response.json({ error: 'Missing tag' }, { status: 400 });
}
```

### Revalidate entire path
```ts
import { revalidatePath } from 'next/cache';

revalidatePath('/blog');           // Revalidate specific path
revalidatePath('/blog/[slug]', 'page'); // Revalidate dynamic page
revalidatePath('/', 'layout');     // Revalidate all pages under layout
```

---

## §4 — Server Actions

### Form submission (progressive enhancement)
```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
});

export async function createPost(prevState: any, formData: FormData) {
  const validated = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.post.create({ data: validated.data });
  revalidatePath('/blog');
  redirect('/blog');
}
```

```tsx
// app/blog/new/page.tsx
import { createPost } from '@/app/actions';
import { useActionState } from 'react';

export default function NewPost() {
  const [state, formAction, isPending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" />
      {state?.errors?.title && <p>{state.errors.title}</p>}

      <textarea name="content" />
      {state?.errors?.content && <p>{state.errors.content}</p>}

      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### Server Action called outside forms
```tsx
'use client';

import { useActionState, useOptimistic } from 'react';
import { toggleLike } from '@/app/actions';

function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [optimisticLikes, addOptimistic] = useOptimistic(
    initialLikes,
    (state, newCount: number) => newCount
  );

  const handleLike = async () => {
    addOptimistic(optimisticLikes + 1);
    await toggleLike(postId);
  };

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>;
}
```

### Server Action security
```ts
'use server';

import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function deletePost(formData: FormData) {
  // Always authenticate
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // Rate limiting
  const { success } = await rateLimit(session.user.id);
  if (!success) throw new Error('Rate limited');

  // Authorization check
  const postId = formData.get('id') as string;
  const post = await db.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== session.user.id) throw new Error('Forbidden');

  await db.post.delete({ where: { id: postId } });
  revalidatePath('/blog');
}
```

**Key points:**
- `useActionState` (React 19) replaces `useFormState`
- `useOptimistic` for optimistic updates
- Server Actions work without JavaScript (progressive enhancement)
- Always validate + authenticate inside Server Actions
- Use `redirect()` for navigation after mutations

---

## §5 — Streaming & Suspense

### Page-level streaming
```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This renders immediately */}
      <nav>...</nav>

      {/* These stream in as data arrives */}
      <Suspense fallback={<Skeleton />}>
        <StatsChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

async function StatsChart() {
  const stats = await fetch('https://api.example.com/stats'); // slow
  return <Chart data={stats} />;
}
```

### Streaming with loading.tsx
```tsx
// app/dashboard/loading.tsx — automatic Suspense boundary
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-200 rounded mt-4" />
    </div>
  );
}
```

### Streaming with error.tsx
```tsx
// app/dashboard/error.tsx — must be Client Component
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Parallel data fetching
```tsx
export default async function Page() {
  // ❌ Sequential (slow)
  const user = await getUser();
  const posts = await getPosts(user.id);

  // ✅ Parallel (fast)
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);

  return <div>...</div>;
}
```

---

## §6 — Partial Prerendering (PPR)

PPR combines static and dynamic content in the same route.

```tsx
// next.config.ts
const nextConfig = {
  experimental: {
    ppr: true, // Enable Partial Prerendering
  },
};
```

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react';

export const experimental_ppr = true;

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Static shell — cached at build time */}
      <header>My Store</header>
      <ProductInfo id={params.id} />

      {/* Dynamic content — streamed at request time */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={params.id} />
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations id={params.id} />
      </Suspense>
    </div>
  );
}

// Static component (prerendered)
async function ProductInfo({ id }: { id: string }) {
  const product = await db.product.findUnique({ where: { id } });
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}

// Dynamic component (streamed)
async function ProductReviews({ id }: { id: string }) {
  const reviews = await fetch(`https://api.example.com/reviews/${id}`, {
    cache: 'no-store',
  });
  return <ReviewList reviews={reviews} />;
}
```

---

## §7 — Route Handlers & Middleware

### Route Handlers (API routes)
```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, limit } = QuerySchema.parse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  const users = await db.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(users);
}

// Dynamic route handler
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Note: params is a Promise in Next.js 15
) {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}
```

### Middleware
```ts
// middleware.ts (root of project, not inside app/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('session-token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*'),
};
```

**Next.js 15 note:** `params` and `searchParams` are now Promises in Route Handlers, Server Components, and Layouts. Always `await` them.

---

## §8 — Performance Optimization

### Image optimization
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority          // Preload above-the-fold images
  placeholder="blur" // Blur placeholder while loading
/>
```

### Font optimization
```ts
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

### Script optimization
```tsx
import Script from 'next/script';

<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive" // Load after page becomes interactive
/>
```

### Dynamic imports
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});
```

### Metadata API
```ts
// Static metadata
export const metadata = {
  title: 'My Page',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}
```

### Generate static params
```ts
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } });
  return posts.map(post => ({ slug: post.slug }));
}

// Generate sitemap
export { generateMetadata } from './sitemap';
```

---

## §9 — Common Pitfalls & Debugging

### ❌ Common mistakes

1. **Forgetting `'use client'`** — Using `useState`, `useEffect`, `onClick` in Server Component
   ```tsx
   // ❌ Error: useState not available in Server Component
   export default function Page() {
     const [open, setOpen] = useState(false);
   }
   // ✅ Add 'use client' or extract to client component
   ```

2. **Waterfall data fetching** — Awaiting sequentially instead of `Promise.all`
   ```tsx
   // ❌ Sequential
   const user = await getUser();
   const posts = await getPosts(user.id);
   // ✅ Parallel
   const [user, posts] = await Promise.all([getUser(), getPosts()]);
   ```

3. **Not handling loading/error states** — Always use `loading.tsx` and `error.tsx`

4. **Mutating state in Server Components** — Server Components are read-only

5. **Forgetting to revalidate** — After mutations, call `revalidatePath()` or `revalidateTag()`

6. **Not awaiting params in Next.js 15** — `params` is now a Promise
   ```tsx
   // ❌ Next.js 14 style
   export default function Page({ params }: { params: { id: string } }) {
     const id = params.id;
   }
   // ✅ Next.js 15 style
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
   }
   ```

7. **Overusing `'use client'`** — Only mark components as client when they need interactivity

8. **Not using `Link` for navigation** — `<Link>` enables client-side navigation and prefetching

### ✅ Best practices checklist

- [ ] Use Server Components by default, Client Components only when needed
- [ ] Parallelize data fetching with `Promise.all`
- [ ] Use `loading.tsx` and `error.tsx` for every route segment
- [ ] Validate all Server Action inputs with Zod
- [ ] Authenticate and authorize inside Server Actions
- [ ] Use `revalidatePath`/`revalidateTag` after mutations
- [ ] Optimize images with `next/image`
- [ ] Use `next/font` for automatic font optimization
- [ ] Set proper `metadata` for SEO
- [ ] Use `generateStaticParams` for static generation of dynamic routes
- [ ] Enable PPR for routes with mixed static/dynamic content
- [ ] Use `dynamic()` imports for heavy client-only components

---

## Quick Reference — Next.js 15 Breaking Changes

| Change | Migration |
|--------|-----------|
| `params` is a Promise | `await params` in async components |
| `searchParams` is a Promise | `await searchParams` in page props |
| `fetch` defaults to `no-cache` | Explicitly set `cache: 'force-cache'` for static |
| `next/image` default `quality` is 75 | Set explicitly if different |
| `experimental.reactCompiler` available | Enable for automatic memoization |
| `after()` API | Run non-blocking work after response |

---

## Font Swapping Pattern (Tailwind CSS 4 + next/font)

When swapping Google Fonts across a Next.js project:

1. **Update `layout.tsx`** — change the import + variable:
   ```tsx
   // Before
   import { Playfair_Display, DM_Sans } from "next/font/google";
   // After
   import { Instrument_Serif, Inter } from "next/font/google";

   const instrumentSerif = Instrument_Serif({
     subsets: ["latin"],
     weight: ["400"],
     variable: "--font-instrument-serif",
     display: "swap",
   });
   const inter = Inter({
     subsets: ["latin"],
     weight: ["300", "400", "500", "600", "700"],
     variable: "--font-inter",
     display: "swap",
   });
   ```

2. **Update `globals.css`** — change body and heading font-family references:
   ```css
   body { font-family: var(--font-inter), system-ui, sans-serif; }
   h1, h2, h3, h4, h5, h6 { font-family: var(--font-instrument-serif), serif; }
   ```

3. **Bulk-replace across components** — use `sed` for mass font variable swaps:
   ```bash
   cd src/components
   sed -i 's/var(--font-dm-sans)/var(--font-inter)/g' *.tsx
   sed -i 's/var(--font-playfair-display)/var(--font-instrument-serif)/g' *.tsx
   ```

4. **Weight mapping**:
   - Body text: `fontWeight: 300` (Inter light) for elegant feel
   - Labels/small: `fontWeight: 400-500`
   - Titles: `fontWeight: 600` or rely on Instrument Serif's inherent weight

5. **Tracking** — use negative tracking (`tracking-[-2px]`) on large display
   headlines for a tighter, more premium look.

## References

- Official docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Caching: https://nextjs.org/docs/app/building-your-application/caching
- PPR: https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
- Migration from Pages: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
