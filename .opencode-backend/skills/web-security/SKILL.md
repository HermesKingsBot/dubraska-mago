---
name: web-security
description: "Web security: OWASP Top 10 (2024-2025), CSP, CORS, XSS prevention, CSRF protection, security headers, input validation, authentication, Next.js security, Express security. Use when implementing security measures, auditing vulnerabilities, configuring CSP/CORS, or handling authentication."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [security, owasp, xss, csrf, csp, cors, authentication, headers, web-security]
    related_skills: [nextjs, deployment, express]
---

# Web Security — OWASP Top 10 & Modern Best Practices

Comprehensive security guide for full-stack web applications (2024-2025).

## When to Use

| Task | Section |
|------|---------|
| OWASP Top 10 overview | §1 OWASP Top 10 |
| Content Security Policy | §2 CSP |
| CORS configuration | §3 CORS |
| XSS prevention | §4 XSS |
| CSRF protection | §5 CSRF |
| Security headers | §6 Security Headers |
| Input validation | §7 Input Validation |
| Authentication patterns | §8 Authentication |
| Next.js security | §9 Next.js Security |
| Express.js security | §10 Express.js Security |
| Testing for vulnerabilities | §11 Security Testing |

---

## §1 — OWASP Top 10 (2024)

Updated from 2021 edition. Key categories web developers must know:

### A01: Broken Access Control
- **Most common vulnerability** — users accessing resources they shouldn't
- **Prevention:**
  - Deny by default (whitelist approach)
  - Implement proper authorization on server-side (never rely on client-side checks alone)
  - Disable directory listing
  - Log access control failures
  - Use UUIDs instead of predictable IDs where possible

```ts
// ❌ BAD: Trusting client-provided role
function AdminPanel({ userRole }: { userRole: string }) {
  if (userRole === 'admin') return <AdminDashboard />;
  return <Unauthorized />;
}

// ✅ GOOD: Server-side authorization check
async function AdminPanel() {
  const session = await auth();
  if (!session?.user?.roles.includes('admin')) {
    redirect('/unauthorized');
  }
  return <AdminDashboard />;
}
```

### A02: Cryptographic Failures
- Weak hashing algorithms (MD5, SHA1 without salt)
- Hardcoded secrets in code
- **Prevention:**
  - Use `bcrypt`, `argon2`, or `scrypt` for passwords
  - Use `crypto.randomUUID()` for tokens
  - Never log sensitive data (passwords, tokens, PII)
  - Encrypt data at rest and in transit

### A03: Injection (SQL, NoSQL, Command, LDAP)
- **Prevention:**
  - Always use parameterized queries / prepared statements
  - Validate and sanitize all inputs
  - Use ORM (Prisma, Drizzle) which handles escaping

```ts
// ❌ SQL Injection vulnerable
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Parameterized (Prisma)
const user = await prisma.user.findUnique({ where: { email } });
```

### A04: Insecure Design
- Missing rate limiting
- No input size limits
- **Prevention:** Threat modeling, secure design patterns, rate limiting

### A05: Security Misconfiguration
- Default credentials left unchanged
- Verbose error messages exposing internals
- Unnecessary features enabled
- **Prevention:** Hardening guides, automated scanning, minimal installations

### A06: Vulnerable and Outdated Components
- **Prevention:** Regular dependency audits (`npm audit`, Snyk, Dependabot)
- Pin versions in `package.json`
- Review changelogs for security patches

### A07: Identification and Authentication Failures
- Weak password policies
- Session fixation
- **Prevention:** MFA, secure session management, password complexity requirements

### A08: Software and Data Integrity Failures
- Unsigned updates, unverified CDN resources
- **Prevention:** SRI (Subresource Integrity), signed packages

### A09: Security Logging and Monitoring Failures
- **Prevention:** Log auth events, input validation failures, access denied events

### A10: Server-Side Request Forgery (SSRF)
- **Prevalidation of URLs, blocklists for internal IPs**

---

## §2 — Content Security Policy (CSP)

CSP is your first line of defense against XSS, clickjacking, and data injection attacks.

### Strict CSP (Recommended)

```ts
// middleware.ts (Next.js)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP_POLICY = `
  default-src 'self';
  script-src 'self${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} 'nonce-{RANDOM}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com ${process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : ''};
  media-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const csp = CSP_POLICY.replace('{RANDOM}', nonce);

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce); // Pass nonce to render
  return response;
}
```

### Report-Only Mode (Testing)

```ts
response.headers.set('Content-Security-Policy-Report-Only', csp);
// Plus: report-uri /csp-report for violation reports
```

### Nonce-based Scripts (Next.js)

```tsx
// Get nonce from headers in Server Component
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce');

  return (
    <>
      <Script
        src="https://example.com/script.js"
        nonce={nonce || undefined}
      />
    </>
  );
}
```

### CSP Checklist
- [ ] `default-src 'self'` as base restriction
- [ ] No `'unsafe-inline'` in `script-src` (use nonces/hashes)
- [ ] `object-src 'none'` to block plugins
- [ ] `base-uri 'self'` to prevent base tag hijacking
- [ ] `frame-ancestors 'none'` to prevent clickjacking
- [ ] Use `Report-Only` mode first, then enforce

---

## §3 — CORS Configuration

### Safe CORS Setup

```ts
// Next.js Route Handler
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://myapp.com',
  'https://www.myapp.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
];

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24h
    },
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  if (!isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(
    { data: 'hello' },
    {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
}
```

### Express.js CORS

```ts
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = ['https://myapp.com'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
```

### ❌ Common CORS Mistakes
- `Access-Control-Allow-Origin: *` with `credentials: true` (browser blocks this)
- Allowing all origins based on regex (bypasses can bypass with `https://evil.com?.yourdomain.com`)
- Not caching preflight responses (performance hit on every cross-origin request)

---

## §4 — XSS Prevention

### React XSS Protection

React escapes JSX expressions by default, but there are still vectors:

```tsx
// ❌ DANGEROUS: dangerouslySetInnerHTML
function UserContent({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✅ SAFE: Sanitize first with DOMPurify
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

function UserContent({ html }: { html: string }) {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const clean = purify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'] });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ❌ DANGEROUS: href with javascript: protocol
function UserLink({ url }: { url: string }) {
  return <a href={url}>Click</a>; // Can be "javascript:alert(1)"
}

// ✅ SAFE: Validate URL scheme
function UserLink({ url }: { url: string }) {
  const safeUrl = url.startsWith('http://') || url.startsWith('https://')
    ? url
    : '#';
  return <a href={safeUrl}>Click</a>;
}

// ❌ DANGEROUS: Using user input in eval/new Function
const result = eval(userInput);
const fn = new Function(userInput);

// ✅ NEVER use eval/new Function with user input
```

### Next.js: Sanitize Server Action Inputs

```ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const CommentSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(5000)
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] })),
});

export async function postComment(formData: FormData) {
  const raw = CommentSchema.parse({
    content: formData.get('content'),
  });
  await db.comment.create({ data: raw });
}
```

### URL Validation Utility

```ts
// lib/utils/sanitize.ts
export function sanitizeUrl(url: string, allowedProtocols = ['http:', 'https:', 'mailto:']): string | null {
  try {
    const parsed = new URL(url);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function sanitizeEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? email : null;
}
```

---

## §5 — CSRF Protection

### Next.js (App Router)

Next.js App Router with Server Actions provides CSRF protection by default via the **double-submit cookie pattern** + **Origin/Referer header validation**. But for additional protection:

```ts
// middleware.ts — Custom CSRF token for non-form requests
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

export function middleware(request: NextRequest) {
  // Skip safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return NextResponse.next();
  }

  // Validate Origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, `https://${host}`];

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
  }

  const response = NextResponse.next();
  // Set CSRF token cookie for client-side reads
  if (!request.cookies.get('csrf-token')) {
    response.cookies.set('csrf-token', randomBytes(32).toString('hex'), {
      httpOnly: false, // JavaScript needs to read this for fetch requests
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }
  return response;
}
```

### Express.js CSRF Protection

```ts
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

app.use(csrfProtection);

// Send token to client in API responses
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

### Nonce-based Fetch (Client-side)

```ts
// lib/csrf.ts
async function fetchWithCsrf(url: string, options: RequestInit = {}) {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1];

  return fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
  });
}
```

---

## §6 — Security Headers

### Essential Security Headers (Next.js middleware.ts)

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Strict-Transport-Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '0'); // CSP replaces this

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (disable unnecessary browser features)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  // Cross-Origin policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  // Cache control for authenticated pages
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
  }

  return response;
}
```

### Header Quick Reference

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | Restrict features | Feature restriction |
| `X-Request-Id` | UUID | Request tracing |

---

## §7 — Input Validation

### Zod Validation (Recommended for TypeScript)

```ts
import { z } from 'zod';
import { router, publicProcedure } from './trpc';

// Comprehensive input validation schemas
const EmailSchema = z
  .string()
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email too long')
  .email('Invalid email format')
  .transform(val => val.toLowerCase().trim());

const PasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128)
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

const CreateUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Invalid characters in name'),
  age: z.number().int().min(13).max(120).optional(),
  role: z.enum(['user', 'editor', 'admin']).default('user'),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Array validation
  tags: z.array(z.string().max(30)).max(10),
}).strict(); // Reject unknown keys

// Usage in API route
export const createUser = publicProcedure
  .input(CreateUserSchema)
  .mutation(async ({ input }) => {
    // input is fully typed and validated
    return await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        // Never store raw password!
        passwordHash: await hashPassword(input.password),
      },
    });
  });
```

### File Upload Validation

```ts
// lib/validation/upload.ts
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }

  // Check magic bytes for actual file type (not just extension)
  // This prevents uploading .jpg files that are actually .exe

  return { valid: true };
}

// Read file header for magic byte validation
export async function validateFileMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (file.type === 'image/jpeg') {
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  }

  // PNG: 89 50 4E 47
  if (file.type === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  }

  // WEBP: RIFF....WEBP
  if (file.type === 'image/webp') {
    return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  }

  return true; // Fall through for unknown types
}
```

---

## §8 — Authentication Patterns

### Secure Session Management

```ts
// lib/auth/session.ts (using NextAuth v5 / Auth.js)
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // OAuth providers preferred over credentials
    Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    GitHub({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.myapp.com' : undefined,
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
```

### Password Hashing

```ts
// lib/auth/password.ts
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

// Alternative: argon2 (more secure, recommended for new projects)
// import argon2 from 'argon2';
// export async function hashPassword(password: string): Promise<string> {
//   return argon2.hash(password, { type: argon2.argon2id });
// }
```

### Rate Limiting

Two approaches — zero-dependency (in-memory) or Upstash Redis (distributed):

#### Option A: In-Memory Rate Limiting (Zero Dependencies)

Best for single-instance deployments (Vercel serverless, simple VPS). No external deps needed.

```ts
// lib/rate-limit.ts

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyPrefix: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const key = `${config.keyPrefix}:${identifier}`
  const entry = store.get(key)

  // Periodic cleanup to prevent memory leak
  if (store.size > 1000) {
    const cutoff = now - config.windowMs
    for (const [k, v] of store.entries()) {
      if (v.resetTime < cutoff) store.delete(k)
    }
  }

  if (!entry || entry.resetTime < now) {
    store.set(key, { count: 1, resetTime: now + config.windowMs })
    return { success: true, limit: config.maxRequests, remaining: config.maxRequests - 1, resetTime: now + config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, limit: config.maxRequests, remaining: 0, resetTime: entry.resetTime, retryAfter: Math.ceil((entry.resetTime - now) / 1000) }
  }

  entry.count++
  return { success: true, limit: config.maxRequests, remaining: config.maxRequests - entry.count, resetTime: entry.resetTime }
}

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, keyPrefix: "auth" },
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: "login" },
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "register" },
  api: { windowMs: 60 * 1000, maxRequests: 60, keyPrefix: "api" },
  search: { windowMs: 60 * 1000, maxRequests: 30, keyPrefix: "search" },
  export: { windowMs: 60 * 60 * 1000, maxRequests: 5, keyPrefix: "export" },
  import: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "import" },
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "contact" },
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp
  return "unknown"
}

export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { success: false, error: "Demasiadas solicitudes. Intenta más tarde.", retryAfter: result.retryAfter },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
        "Retry-After": String(result.retryAfter || 0),
      },
    }
  )
}
```

Usage in route handlers:
```ts
import { checkRateLimit, RATE_LIMITS, getClientIp, createRateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const result = checkRateLimit(ip, RATE_LIMITS.login)
  if (!result.success) return createRateLimitResponse(result)
  // ... proceed with login logic
}
```

#### Option B: Upstash Redis (Distributed/Multi-instance)

---

## §9 — Next.js Security

### Server Action Security Checklist

```ts
'use server';

import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// ✅ Complete secure Server Action pattern
export async function updateProfile(formData: FormData) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // 2. Rate limit
  const { success } = await rateLimit.limit(session.user.id);
  if (!success) {
    throw new Error('Rate limited');
  }

  // 3. Validate input
  const schema = z.object({
    name: z.string().min(1).max(100).trim(),
    bio: z.string().max(500).trim().optional(),
  });

  const validated = schema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });

  if (!validated.success) {
    return { error: 'Invalid input' };
  }

  // 4. Authorize (verify user can modify this resource)
  // Already authenticated, modifying own profile

  // 5. Perform mutation
  await prisma.user.update({
    where: { id: session.user.id },
    data: validated.data,
  });

  // 6. Revalidate cache
  revalidatePath('/profile');
}
```

### Next.js Config Security

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security: Disable x-powered-by header
  poweredByHeader: false,

  // Security: Strict mode
  reactStrictMode: true,

  // Security: Prevent open redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'query', key: 'redirect' }],
        permanent: false,
        destination: '/',
        // Only allow relative redirects
      },
    ];
  },

  // Security: Restrict image domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.myapp.com' },
    ],
  },

  // Security: Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

### Environment Variables Security

```bash
# .env.local (NEVER commit this)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=use-openssl-rand-base64-32
NEXTAUTH_URL=https://myapp.com

# ❌ NEVER prefix client secrets with NEXT_PUBLIC_
# NEXT_PUBLIC_SECRET=bad  # This exposes to browser!

# ✅ Public vars are OK (they're meant to be public)
NEXT_PUBLIC_APP_URL=https://myapp.com
NEXT_PUBLIC_GA_ID=UA-XXXXX
```

---

## §10 — Express.js Security

### Express Security Middleware Stack

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { xss } from 'express-xss-sanitizer';

const app = express();

// 1. Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// 2. CORS
app.use(cors({
  origin: ['https://myapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 86400,
}));

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);

// 4. Body parsing with size limits
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 5. Data sanitization against NoSQL injection
app.use(mongoSanitize());

// 6. XSS sanitization
app.use(xss());

// 7. Prevent HTTP parameter pollution
app.use(hpp());

// 8. Custom security middleware
app.use((req, res, next) => {
  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');

  // Add request ID for tracing
  req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.headers['x-request-id']);

  next();
});
```

### Express Error Handling (Don't Leak Info)

```ts
// middleware/error.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log full error internally
  console.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    requestId: req.headers['x-request-id'],
  });

  // Send safe response to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Generic error for unknown errors (don't leak details)
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
}
```

---

## §11 — Security Testing

### Automated Security Scanning

```bash
# npm audit
npm audit --audit-level=high

# Snyk
npx snyk test

# OWASP ZAP (automated scanner)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-app.com

# npm outdated for dependency freshness
npm outdated
```

### Security Test Cases (Vitest)

```ts
// __tests__/security/headers.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Security Headers', () => {
  it('should include HSTS header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('should prevent MIME sniffing', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should set X-Frame-Options', async () => {
    const res = await request(app).get('/');
    expect(['DENY', 'SAMEORIGIN']).toContain(res.headers['x-frame-options']);
  });

  it('should not expose server technology', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('should set proper CORS headers', async () => {
    const res = await request(app)
      .options('/api/users')
      .set('Origin', 'https://evil.com');
    expect(res.headers['access-control-allow-origin']).not.toBe('https://evil.com');
  });
});

describe('Input Validation', () => {
  it('should reject SQL injection attempts', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: "'; DROP TABLE users; --" });
    expect(res.status).toBe(400);
  });

  it('should reject XSS in user input', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ content: '<script>alert("xss")</script>' });
    expect(res.status).toBe(400);
  });

  it('should enforce password complexity', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@test.com', password: '123' });
    expect(res.status).toBe(400);
  });
});
```

### Playwright E2E Security Tests

```ts
// e2e/security.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security E2E', () => {
  test('authenticated routes redirect unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('CSRF token present in forms', async ({ page }) => {
    await page.goto('/login');
    const csrfToken = await page.locator('input[name="csrfToken"]');
    await expect(csrfToken).toHaveCount(1);
  });

  test('sensitive data not in localStorage', async ({ page, context }) => {
    await page.goto('/login');
    // Login flow...

    const storage = await context.storageState();
    const localStorage = storage.origins[0]?.localStorage || [];

    const sensitiveKeys = ['password', 'token', 'secret', 'creditCard'];
    for (const item of localStorage) {
      for (const key of sensitiveKeys) {
        expect(item.name.toLowerCase()).not.toContain(key);
      }
    }
  });
});
```

---

## Security Checklist Summary

### Before Production
- [ ] CSP configured (start with Report-Only, then enforce)
- [ ] CORS restricted to specific origins
- [ ] All inputs validated with Zod
- [ ] Rate limiting on all API routes
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Sessions: httpOnly, secure, sameSite cookies
- [ ] No secrets in client-side code
- [ ] File uploads validated (type, size, magic bytes)
- [ ] Error messages don't leak internals
- [ ] Dependencies audited (`npm audit`)
- [ ] HTTPS enforced
- [ ] Database connections use parameterized queries
- [ ] Logging configured for auth events

### Per Request
- [ ] Authenticate
- [ ] Rate limit
- [ ] Validate input
- [ ] Authorize (check ownership/role)
- [ ] Sanitize output
- [ ] Log security events

---

## References

- `references/rate-limit-in-memory.md` — Zero-dependency rate limiting with Map, auto-cleanup, IP extraction, Next.js integration
- OWASP Top 10 (2024): https://owasp.org/www-project-top-ten/
- CSP Guide: https://content-security-policy.com/
- web.dev Security: https://web.dev/security/
- Next.js Security: https://nextjs.org/docs/app/building-your-application/security
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
- Helmet.js: https://helmetjs.github.io/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- Mozilla Web Security Guidelines: https://developer.mozilla.org/en-US/docs/Web/Security
- Snyk Advisor: https://snyk.io/advisor/
