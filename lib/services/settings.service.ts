import { mainClient } from "../axios"
import { API_ENDPOINTS } from "../constants/api"

export interface AppSetting {
  id: string
  key: string
  value: string
  type: string
  createdAt: string
  updatedAt: string
}

export class SettingsService {
  /**
   * Fetch a single public setting by key.
   */
  static async get(key: string) {
    return mainClient.get<AppSetting>(API_ENDPOINTS.Settings.ByKey(key))
  }

  /**
   * Fetch all public settings.
   */
  static async getAll() {
    return mainClient.get<AppSetting[]>(API_ENDPOINTS.Settings.Base)
  }

  /**
   * Update (or create) a setting. Superadmin only.
   */
  static async update(key: string, value: string | number, type?: string) {
    return mainClient.patch(API_ENDPOINTS.Settings.Base, { key, value: String(value), type })
  }

  /**
   * Fetch all settings — admin/superadmin only.
   */
  static async getAllForAdmin() {
    return mainClient.get<AppSetting[]>(API_ENDPOINTS.Settings.Admin)
  }

  /**
   * Update (or create) a setting — superadmin only. Uses the admin endpoint.
   */
  static async adminUpdate(key: string, value: string | number, type?: string) {
    return mainClient.patch<AppSetting>(API_ENDPOINTS.Settings.Admin, {
      key,
      value: String(value),
      type,
    })
  }

  /**
   * Convenience helper — fetch the registration fee as a number.
   * Returns 0 if the setting is not found or the fetch fails.
   */
  static async getRegistrationFee(): Promise<number> {
    try {
      const result = await SettingsService.get("registration_fee")
      if (result.success && result.data) {
        return Number(result.data.value)
      }
      return 0
    } catch {
      return 0
    }
  }
}
