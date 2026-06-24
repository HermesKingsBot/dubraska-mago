# Next.js — Practical Code Examples

## Complete App Router Project Structure

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── loading.tsx             # Global loading UI
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Global styles
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard home
│   │   ├── loading.tsx         # Dashboard loading skeleton
│   │   └── settings/
│   │       └── page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Individual post
│   │   └── actions.ts          # Blog server actions
│   └── api/
│       ├── revalidate/
│       │   └── route.ts        # On-demand revalidation
│       └── webhooks/
│           └── route.ts        # Webhook handler
├── components/
│   ├── ui/                     # Shared UI components
│   ├── layout/
│   └── features/
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## next.config.ts — Recommended Setup

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
};

export default nextConfig;
```

## Database Access Pattern (Server Component)

```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

```ts
// app/users/page.tsx
export const revalidate = 3600;

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Authentication Pattern with Middleware

```ts
// lib/auth.ts
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return { user: { id: payload.sub as string, email: payload.email as string } };
  } catch {
    return null;
  }
}
```

```ts
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session');

  if (!session && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Parallel Data Fetching with Error Isolation

```ts
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersSection />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivitySection />
      </Suspense>
    </div>
  );
}

async function StatsSection() {
  const stats = await fetch('https://api.internal/stats', {
    next: { revalidate: 300, tags: ['stats'] },
  }).then(r => r.json());
  return <StatsGrid data={stats} />;
}

async function OrdersSection() {
  const orders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { customer: { select: { name: true } } },
  });
  return <OrdersTable orders={orders} />;
}

async function ActivitySection() {
  const activity = await db.activityLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
  });
  return <ActivityFeed items={activity} />;
}
```

## Dynamic Route with generateStaticParams

```ts
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author.name}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```
