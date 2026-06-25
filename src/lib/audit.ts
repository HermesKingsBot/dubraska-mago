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
    console.error("Failed to log activity:", entry.description)
  }
}

export async function logCreate(user: { userId: string; email: string }, entityType: string, entity: { id: string; name?: string }, request?: NextRequest) {
  return logActivity({
    userId: user.userId,
    userEmail: user.email,
    action: "CREATE",
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.id,
    description: `Creó ${entityType}: ${entity.name || entity.id}`,
    request,
  })
}

export async function logUpdate(user: { userId: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldValues: Record<string, unknown>, newValues: Record<string, unknown>, request?: NextRequest) {
  return logActivity({
    userId: user.userId,
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

export async function logDelete(user: { userId: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldValues?: Record<string, unknown>, request?: NextRequest) {
  return logActivity({
    userId: user.userId,
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

export async function logStatusChange(user: { userId: string; email: string }, entityType: string, entity: { id: string; name?: string }, oldStatus: string, newStatus: string, request?: NextRequest) {
  return logActivity({
    userId: user.userId,
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
