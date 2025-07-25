import { AxiosService } from "../ax"
import type { Transaction } from "../dumps/admin-data"

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
    return AxiosService.get<Transaction[]>("/transactions", { params: filters })
  }

  static async getById(id: string) {
    return AxiosService.get<Transaction>(`/transactions/${id}`)
  }

  static async refund(id: string, reason?: string) {
    return AxiosService.post(`/transactions/${id}/refund`, { reason })
  }

  static async getStats() {
    return AxiosService.get("/transactions/stats")
  }
}
