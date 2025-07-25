import { AxiosService } from "../ax"

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

export class SubscriptionsService {
  static async getAll(filters?: SubscriptionFilters) {
    return AxiosService.get<Subscription[]>("/subscriptions", { params: filters })
  }

  static async getById(id: string) {
    return AxiosService.get<Subscription>(`/subscriptions/${id}`)
  }

  static async create(subscriptionData: any) {
    return AxiosService.post<Subscription>("/subscriptions", subscriptionData)
  }

  static async update(id: string, subscriptionData: any) {
    return AxiosService.put<Subscription>(`/subscriptions/${id}`, subscriptionData)
  }

  static async cancel(id: string) {
    return AxiosService.delete(`/subscriptions/${id}`)
  }

  static async suspend(id: string) {
    return AxiosService.post(`/subscriptions/${id}/suspend`)
  }

  static async resume(id: string) {
    return AxiosService.post(`/subscriptions/${id}/resume`)
  }

  static async getStats() {
    return AxiosService.get("/subscriptions/stats")
  }
}
