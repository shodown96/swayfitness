import { FullAccount } from "@/types/account"
import { PaginatedData } from "@/types/common"
import { Account, AccountRole, AccountStatus } from "@prisma/client"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"
import { InviteAdminParamsType } from "../validations"

export interface AdminFilters {
  search?: string
  role?: string
  status?: string
  page?: number
  limit?: number
}

export interface CreateAdminData {
  name: string
  email: string
  role: AccountRole,
  status?: AccountStatus
}

export interface AdminStats {
  totalAdmins: number,
  superAdmins: number,
  activeAdmins: number,
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

  static async update(id: string, adminData: Partial<Account>) {
    return mainClient.put<FullAccount>(API_ENDPOINTS.Admins.ById(id), adminData)
  }

  static async delete(id: string) {
    return mainClient.delete(API_ENDPOINTS.Admins.ById(id))
  }

  static async invite(values:InviteAdminParamsType) {
    return mainClient.post(API_ENDPOINTS.Admins.Invite, values)
  }

  static async stats() {
    return mainClient.get<AdminStats>(API_ENDPOINTS.Admins.Stats)
  }
}
