import { PaginatedData } from "@/types/common"
import { FullTransaction } from "@/types/plan"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface TransactionFilters {
  search?: string
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export class TransactionsService {
  static async getAll(filters?: TransactionFilters) {
    return mainClient.get<PaginatedData<FullTransaction>>(API_ENDPOINTS.Transactions.Base, { params: filters })
  }

  static async getById(id: string) {
    return mainClient.get<FullTransaction>(API_ENDPOINTS.Transactions.ById(id))
  }

  static async refund(id: string, reason?: string) {
    return mainClient.post(API_ENDPOINTS.Transactions.Refund(id), { reason })
  }

  static async getStats() {
    return mainClient.get(API_ENDPOINTS.Transactions.Stats)
  }
}
