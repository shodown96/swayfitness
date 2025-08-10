import { PaginatedData } from "@/types/common"
import { FullPlan } from "@/types/plan"
import { PlanInterval, PlanStatus } from "@prisma/client"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface PlanFilters {
  search?: string
  status?: string
  interval?: string
  page?: number
  limit?: number
}

export interface CreatePlanData {
  name: string
  description: string
  amount: number
  interval: PlanInterval
  features: string[]
  status: string
}

export class PlansService {
  static async getAll(filters?: PlanFilters) {
    return mainClient.get<PaginatedData<FullPlan>>(API_ENDPOINTS.Plans.Base, { params: filters })
  }

  static async getAllForAdmin(filters?: PlanFilters) {
    return mainClient.get<PaginatedData<FullPlan>>(API_ENDPOINTS.Plans.AdminPlans, { params: filters })
  }

  static async getById(id: string) {
    return mainClient.get<FullPlan>(API_ENDPOINTS.Plans.ById(id))
  }

  static async create(planData: CreatePlanData) {
    return mainClient.post<FullPlan>(API_ENDPOINTS.Plans.Base, planData)
  }

  static async update(id: string, planData: Partial<CreatePlanData>) {
    return mainClient.put<FullPlan>(API_ENDPOINTS.Plans.ById(id), planData)
  }

  static async delete(id: string) {
    return mainClient.delete(API_ENDPOINTS.Plans.ById(id))
  }

  static async getStats() {
    return mainClient.get(API_ENDPOINTS.Plans.Stats)
  }
}
