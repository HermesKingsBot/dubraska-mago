# In-Memory Rate Limiting for Next.js

Zero-dependency rate limiting using a Map with automatic cleanup. Best for single-instance deployments (Vercel serverless, VPS).

## When to Use

- Single-instance Next.js deployments
- No Redis/Upstash available
- Simple API protection needs
- Development/testing environments

## Architecture

```
Request → getClientIp() → checkRateLimit(ip, config) → 
  ✅ success:true → Process request → Add X-RateLimit-* headers
  ❌ success:false → Return 429 + Retry-After header
```

## Configurations

| Config | Window | Max | Use For |
|--------|--------|-----|---------|
| `auth` | 15 min | 5 | Auth endpoints |
| `login` | 15 min | 10 | Login attempts |
| `register` | 1 hour | 3 | Registration spam |
| `api` | 1 min | 60 | General API |
| `search` | 1 min | 30 | Search endpoints |
| `export` | 1 hour | 5 | Report exports |
| `import` | 1 hour | 3 | Data imports |
| `contact` | 1 hour | 3 | Contact forms |

## Memory Management

- Auto-cleanup when store > 1000 entries
- Entries auto-expire at `resetTime`
- No TTL/Timer needed — cleanup is opportunistic

## Limitation

Does NOT work across multiple server instances. For multi-instance (Vercel edge, Kubernetes), use Upstash Redis instead.

## Source Pattern

```typescript
// Full implementation in web-security skill §8
import { checkRateLimit, RATE_LIMITS, getClientIp, createRateLimitResponse } from "@/lib/rate-limit"
```
