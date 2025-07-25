import { AxiosService } from "../ax"

export interface DashboardMetrics {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  monthlyRevenue: number
  newMembersThisMonth: number
  memberGrowthRate: number
  revenueGrowthRate: number
  averageRevenuePerMember: number
}

export interface RevenueAnalytics {
  monthly: Array<{ month: string; revenue: number; members: number }>
  yearly: Array<{ year: string; revenue: number; members: number }>
  byPlan: Array<{ planName: string; revenue: number; percentage: number }>
}

export interface MemberAnalytics {
  demographics: {
    ageGroups: Array<{ range: string; count: number }>
    gender: Array<{ gender: string; count: number }>
  }
  retention: {
    monthly: Array<{ month: string; retentionRate: number }>
    byPlan: Array<{ planName: string; retentionRate: number }>
  }
  growth: Array<{ month: string; newMembers: number; churnedMembers: number }>
}

export class AnalyticsService {
  static async getDashboardMetrics() {
    return AxiosService.get<DashboardMetrics>("/analytics/dashboard")
  }

  static async getRevenueAnalytics(period: "monthly" | "yearly" = "monthly") {
    return AxiosService.get<RevenueAnalytics>("/analytics/revenue", { params: { period } })
  }

  static async getMemberAnalytics() {
    return AxiosService.get<MemberAnalytics>("/analytics/members")
  }
}
