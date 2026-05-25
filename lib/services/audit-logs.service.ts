import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface AuditLogEntry {
  id: string
  adminId: string
  action: string
  targetType: string
  targetId: string | null
  description: string
  metadata: Record<string, unknown> | null
  createdAt: string
  admin: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface AuditLogsPage {
  items: AuditLogEntry[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export class AuditLogsService {
  static async getRecent(limit = 10) {
    return mainClient.get<AuditLogsPage>(
      `${API_ENDPOINTS.Admins.AuditLogs}?limit=${limit}&page=1`
    )
  }
}
