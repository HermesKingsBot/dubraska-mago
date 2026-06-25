# Backend — Audit Log System + Soft Delete

## Objective
1. Add `ActivityLog` model to track ALL admin actions (create, update, delete, approve, reject, login, etc.)
2. Convert ALL hard deletes to soft deletes (add `deletedAt` field to models)
3. Create admin API to view audit logs with filters
4. Update all existing DELETE routes to soft delete instead

## What to Do

### 1. Add ActivityLog Model to Prisma (`prisma/schema.prisma`)

```prisma
model ActivityLog {
  id          String   @id @default(cuid())
  userId      String?  // Who performed the action
  userEmail   String?  // Denormalized for quick display
  action      String   // "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "LOGIN", "LOGOUT", "STATUS_CHANGE"
  entityType  String   // "Product", "Category", "Order", "Review", "User", "Testimonial", "SocialLink", "Setting", "Payment"
  entityId    String?  // ID of affected entity
  entityName  String?  // Human-readable name (product name, category name, etc.)
  oldValues   String?  // JSON string of old values (for updates/deletes)
  newValues   String?  // JSON string of new values (for creates/updates)
  description String   // Human-readable description: "Admin eliminó producto: Collar Cadena Dorado"
  ipAddress   String?  // IP if available
  userAgent   String?  // Browser info
  createdAt   DateTime @default(now())
}
```

### 2. Add `deletedAt` to All Models That Need Soft Delete

Add `deletedAt DateTime?` to these models:
- `Product`
- `Category`
- `Testimonial`
- `Review`
- `Order`
- `SocialLink`
- `Setting` (rarely deleted but for consistency)
- `User` (deactivate instead of delete, but add field for completeness)

### 3. Create `src/lib/audit.ts` — Audit Helper

```typescript
import db from "./db"
import { NextRequest } from "next/server"

interface AuditEntry {
  userId?: string
  userEmail?: string
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "LOGIN" | "LOGOUT" | "STATUS_CHANGE" | "BULK_UPDATE"
  entityType: string
  entityId?: string
  entityName?: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  description: string
  request?: NextRequest
}

export async function logActivity(entry: AuditEntry): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        userId: entry.userId,
        userEmail: entry.userEmail,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        entityName: entry.entityName,
        oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
        description: entry.description,
        ipAddress: entry.request?.headers.get("x-forwarded-for") || null,
        userAgent: entry.request?.headers.get("user-agent") || null,
      },
    })
  } catch {
    // Audit logging should never break the main operation
    console.error("Failed to log activity:", entry.description)
  }
}

// Convenience helpers
export async function logCreate(user: { id: string; email: string }, entityType: string, entity: { id: string; name?: string }, request?: NextRequest) {
  return logActivity({
    userId: user.id,
    userEmail: user.email,
    action: "CREATE",
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.id,
    description: `Creó ${entityType}: ${entity.name || entity.id}`,
    request,
  })
}

export async function logUpdate(user: { id: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldValues: Record<string, unknown>, newValues: Record<string, unknown>, request?: NextRequest) {
  return logActivity({
    userId: user.id,
    userEmail: user.email,
    action: "UPDATE",
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.id,
    oldValues,
    newValues,
    description: `Actualizó ${entityType}: ${entity.name || entity.id}`,
    request,
  })
}

export async function logDelete(user: { id: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldValues?: Record<string, unknown>, request?: NextRequest) {
  return logActivity({
    userId: user.id,
    userEmail: user.email,
    action: "DELETE",
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.id,
    oldValues,
    description: `Eliminó ${entityType}: ${entity.name || entity.id}`,
    request,
  })
}

export async function logStatusChange(user: { id: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldStatus: string, newStatus: string, request?: NextRequest) {
  return logActivity({
    userId: user.id,
    userEmail: user.email,
    action: "STATUS_CHANGE",
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.id,
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
    description: `Cambió estado de ${entityType} "${entity.name || entity.id}": ${oldStatus} → ${newStatus}`,
    request,
  })
}
```

### 4. Create `src/lib/soft-delete.ts` — Soft Delete Helpers

```typescript
import { Prisma } from "@prisma/client"

// Add deletedAt: null to all findMany/findUnique queries
export function withSoftDelete<T extends Prisma.ProductWhereInput | Prisma.CategoryWhereInput | Prisma.TestimonialWhereInput | Prisma.ReviewWhereInput | Prisma.OrderWhereInput | Prisma.SocialLinkWhereInput>(where: T): T {
  return { ...where, deletedAt: null }
}

// Soft delete a record
export async function softDelete(model: "product" | "category" | "testimonial" | "review" | "order" | "socialLink", id: string): Promise<void> {
  const db = (await import("./db")).default
  await (db[model] as any).update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

// Restore a soft-deleted record
export async function restore(model: "product" | "category" | "testimonial" | "review" | "order" | "socialLink", id: string): Promise<void> {
  const db = (await import("./db")).default
  await (db[model] as any).update({
    where: { id },
    data: { deletedAt: null },
  })
}
```

### 5. Create Audit Log API Routes

#### `src/app/api/admin/audit-logs/route.ts`
- `GET` — Admin only, get all audit logs with filters:
  - `?action=CREATE|UPDATE|DELETE|APPROVE|REJECT|STATUS_CHANGE`
  - `?entityType=Product|Category|Order|...`
  - `?userId=xxx` — filter by admin
  - `?search=text` — search in description
  - `?from=2026-01-01&to=2026-12-31` — date range
  - `?page=1&limit=50` — pagination
  - Returns: `{ items, total, page, totalPages }`

#### `src/app/api/admin/audit-logs/stats/route.ts`
- `GET` — Admin only, get audit stats:
  - Total actions today/this week/this month
  - Actions by type (pie chart data)
  - Most active admins
  - Recent activity count

#### `src/app/api/admin/audit-logs/[id]/route.ts`
- `GET` — Admin only, get single log detail (with parsed old/new values)

### 6. Update ALL Existing DELETE Routes to Soft Delete

Find every `db.x.delete()` in the API and replace with soft delete:

**Products** (`src/app/api/products/[id]/route.ts`):
- DELETE → PATCH `deletedAt: new Date()`
- Log the action

**Categories** (`src/app/api/categories/[id]/route.ts`):
- DELETE → soft delete
- Log the action

**Testimonials** (`src/app/api/testimonials/[id]/route.ts`):
- DELETE → soft delete
- Log the action

**Reviews** (`src/app/api/reviews/[id]/route.ts`):
- DELETE → soft delete (or keep hard delete for reviews since they're user-generated)
- Log the action

**Orders** (`src/app/api/orders/[id]/route.ts`):
- DELETE → soft delete
- Log the action

**Social Links** (`src/app/api/social-links/[id]/route.ts`):
- DELETE → soft delete
- Log the action

### 7. Update ALL Existing POST/PATCH Routes to Log Actions

Add audit logging to:
- Product create/update
- Category create/update
- Testimonial create/update/approve/reject
- Review approve/reject
- Order status change
- Payment approve/reject
- Settings update
- Social link create/update/delete
- User login (optional, can be noisy)

### 8. Update All GET Routes to Filter Out Soft-Deleted

Add `deletedAt: null` to ALL `findMany` and `findUnique` queries for:
- Products
- Categories
- Testimonials
- Reviews
- Orders
- Social Links

### 9. Update Seed Route

- Add `deletedAt: null` to all create queries
- Add sample audit logs for demo

### 10. Update `src/lib/schemas.ts`

Add audit log query schema:
```typescript
export const auditLogQuerySchema = z.object({
  action: z.enum(["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "STATUS_CHANGE", "LOGIN", "LOGOUT"]).optional(),
  entityType: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(50),
})
```

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file
- Audit logging must NEVER break the main operation (wrap in try/catch)
- All soft deletes must be filterable (admin can see deleted items if needed)

## Files to Read First
- `prisma/schema.prisma` — All models
- `src/app/api/products/[id]/route.ts` — DELETE to convert
- `src/app/api/categories/[id]/route.ts` — DELETE to convert
- `src/app/api/testimonials/[id]/route.ts` — DELETE to convert
- `src/app/api/reviews/[id]/route.ts` — DELETE to convert
- `src/app/api/orders/[id]/route.ts` — DELETE to convert
- `src/app/api/social-links/[id]/route.ts` — DELETE to convert
- `src/app/api/seed/route.ts` — Update for new fields
- `src/lib/auth.ts` — For getting current user in routes

## Verification
1. `npx prisma migrate dev --name audit_soft_delete` — success
2. `npx prisma generate` — success
3. `npm run build` — success
4. Delete a product → check `deletedAt` is set, not actually deleted
5. GET products → soft-deleted products NOT shown
6. `curl http://localhost:3000/api/admin/audit-logs` → returns logs
