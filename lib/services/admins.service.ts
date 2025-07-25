import { FullAccount } from "@/types/account"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"
import { AccountRole, AccountStatus } from "@prisma/client"
import { PaginatedData } from "@/types/common"

export interface AdminFilters {
  search?: string
  role?: string
  status?: AccountStatus
  page?: number
  limit?: number
}

export interface CreateAdminData {
  name: string
  email: string
  role: AccountRole,
  status?: AccountStatus
}

export class AdminsService {
  static async getAll(filters?: AdminFilters) {
    return mainClient.get<PaginatedData<FullAccount>>(API_ENDPOINTS.Admins.Base, { params: filters })
  }

  static async getById(id: string) {
    return mainClient.get<FullAccount>(API_ENDPOINTS.Admins.ById(id))
  }

  static async create(adminData: CreateAdminData) {
    return mainClient.post<FullAccount>(API_ENDPOINTS.Admins.Base, adminData)
  }

  static async update(id: string, adminData: Partial<CreateAdminData>) {
    return mainClient.put<FullAccount>(API_ENDPOINTS.Admins.ById(id), adminData)
  }

  static async delete(id: string) {
    return mainClient.delete(API_ENDPOINTS.Admins.ById(id))
  }

  static async invite(email: string, role: string) {
    return mainClient.post(API_ENDPOINTS.Admins.Invite, { email, role })
  }
}
