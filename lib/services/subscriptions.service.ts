import { PaginatedData } from "@/types/common"
import { FullSubscription } from "@/types/plan"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface Subscription {
  id: string
  memberId: string
  memberName: string
  planId: string
  planName: string
  status: "active" | "expired" | "suspended" | "cancelled"
  startDate: string
  endDate: string
  nextBillingDate: string
  amount: number
  autoRenew: boolean
}

export interface SubscriptionFilters {
  search?: string
  status?: string
  planId?: string
  page?: number
  limit?: number
}

export interface SubscriptionStats {
    activeSubscriptions: number,
    expiredSubscriptions: number,
    suspendedSubscriptions: number,
    totalRevenue: number,
}

export class SubscriptionsService {
  static async getAll(filters?: SubscriptionFilters) {
    return mainClient.get<PaginatedData<FullSubscription>>(API_ENDPOINTS.Subscriptions.Base, { params: filters })
  }

  static async getById(id: string) {
    return mainClient.get<Subscription>(API_ENDPOINTS.Subscriptions.ById(id))
  }

  static async create(subscriptionData: any) {
    return mainClient.post<Subscription>(API_ENDPOINTS.Subscriptions.Base, subscriptionData)
  }

  static async update(id: string, subscriptionData: any) {
    return mainClient.post<Subscription>(API_ENDPOINTS.Subscriptions.ById(id), subscriptionData)
  }

  static async cancel(id: string, values:any) {
    return mainClient.post(API_ENDPOINTS.Subscriptions.Cancel(id), values)
  }

  static async suspend(id: string) {
    return mainClient.post(API_ENDPOINTS.Subscriptions.Suspend(id))
  }

  static async resume(id: string) {
    return mainClient.post(API_ENDPOINTS.Subscriptions.Resume(id))
  }

  static async getStats() {
    return mainClient.get<SubscriptionStats>(API_ENDPOINTS.Subscriptions.Stats)
  }
}
