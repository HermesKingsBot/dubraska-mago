export interface ActivityLog {
  id: string
  userId: string | null
  userEmail: string | null
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "STATUS_CHANGE" | "LOGIN" | "LOGOUT"
  entityType: string
  entityId: string | null
  entityName: string | null
  oldValues: string | null
  newValues: string | null
  description: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface AuditStats {
  today: number
  week: number
  month: number
  total: number
  byAction: Record<string, number>
  byEntity: Record<string, number>
}

export const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-500/15 text-green-400 border-green-500/20",
  UPDATE: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/20",
  APPROVE: "bg-green-500/15 text-green-400 border-green-500/20",
  REJECT: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  STATUS_CHANGE: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  LOGIN: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  LOGOUT: "bg-gray-500/15 text-gray-400 border-gray-500/20",
}

export const ACTION_LABELS: Record<string, string> = {
  CREATE: "Crear",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  APPROVE: "Aprobar",
  REJECT: "Rechazar",
  STATUS_CHANGE: "Cambio estado",
  LOGIN: "Login",
  LOGOUT: "Logout",
}

export const ENTITY_LABELS: Record<string, string> = {
  Product: "Producto",
  Category: "Categoría",
  Order: "Pedido",
  Review: "Reseña",
  User: "Usuario",
  Testimonial: "Testimonio",
  SocialLink: "Red Social",
  Payment: "Pago",
}

export interface TrashItem {
  id: string
  name: string
  entityType: string
  deletedAt: string
  deletedBy: string | null
}
