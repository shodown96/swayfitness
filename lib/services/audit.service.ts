import { prisma } from "@/lib/prisma"

export type AuditAction =
  | "refund_issued"
  | "subscription_cancelled"
  | "member_updated"
  | "member_deleted"
  | "plan_created"
  | "plan_updated"
  | "plan_deleted"
  | "admin_invited"
  | "notification_sent"
  | "settings_updated"

export type AuditTargetType =
  | "transaction"
  | "subscription"
  | "member"
  | "plan"
  | "admin"
  | "notification"
  | "setting"

interface LogParams {
  adminId: string
  action: AuditAction
  targetType: AuditTargetType
  targetId?: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

export class AuditService {
  /**
   * Write an audit log entry.
   * Never throws — auditing must never break the main request flow.
   */
  static async log(params: LogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId ?? null,
          description: params.description,
          metadata: params.metadata ?? undefined,
        },
      })
    } catch (error) {
      console.error("[audit]", error)
    }
  }

  /**
   * Fetch paginated audit logs for the dashboard.
   * Called from the client via the API, not directly.
   */
  static async getLogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
    ])
    return { total, logs }
  }
}
