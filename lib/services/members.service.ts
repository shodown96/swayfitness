import { FullAccount } from "@/types/account"
import { PaginatedData } from "@/types/common"
import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"
import { Account } from "@prisma/client"

export interface MemberFilters {
  search?: string
  status?: string
  plan?: string
  page?: number
  limit?: number
}

export interface CreateMemberData {
  name: string
  email: string
  phone: string
  dob: string | Date
  gender: string
  planId: string
}

export class MembersService {
  static async getAll(filters?: MemberFilters) {
    return mainClient.get<PaginatedData<FullAccount>>(API_ENDPOINTS.Members.Base, { params: filters })
  }

  static async getById(id: string) {
    return mainClient.get<FullAccount>(API_ENDPOINTS.Members.ById(id))
  }

  static async create(memberData: CreateMemberData) {
    return mainClient.post<FullAccount>(API_ENDPOINTS.Members.Base, memberData)
  }

  static async update(memberData: Partial<CreateMemberData>) {
    return mainClient.put<FullAccount>(API_ENDPOINTS.Members.Me, memberData)
  }

  static async updateByAdmin(id: string, memberData: Partial<Omit<Account, 'dob'>> & { dob?: any }) {
    return mainClient.put<FullAccount>(API_ENDPOINTS.Members.ById(id), memberData)
  }

  static async delete(id: string) {
    return mainClient.delete(API_ENDPOINTS.Members.ById(id))
  }

  static async getStats() {
    return mainClient.get(API_ENDPOINTS.Members.Stats)
  }

  static async exportCSV() {
    return mainClient.get<FullAccount>(API_ENDPOINTS.Members.Export)
  }
}
