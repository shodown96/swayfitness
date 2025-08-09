import { FullPlan } from "@/types/plan"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface DashboardMetrics {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  monthlyRevenue: number
  newMembersThisMonth: number
  memberGrowthRate: number
  revenueGrowthRate: number
  averageRevenuePerMember: number
  activeSubscriptions: number
}

export interface AnalyticPlans {
  plans: FullPlan[]
}

export class AnalyticsService {
  static async getDashboardMetrics() {
    return mainClient.get<DashboardMetrics>(API_ENDPOINTS.Analytics.Dashboard)
  }
  static async getPlanAnalytics() {
    return mainClient.get<AnalyticPlans>(API_ENDPOINTS.Analytics.Plans)
  }
}
