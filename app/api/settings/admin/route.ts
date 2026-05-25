import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AuditService } from "@/lib/services/audit.service"
import { NextRequest } from "next/server"

// GET /api/settings/admin — all settings, admin/superadmin only
export async function GET() {
  try {
    const { user } = await checkAuth(true)
    if (!user) {
      return constructResponse({ statusCode: 401, message: ERROR_MESSAGES.AuthenticationError })
    }

    const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } })

    return constructResponse({ statusCode: 200, data: settings })
  } catch (error) {
    console.error("[settings/admin GET]", error)
    return constructResponse({ statusCode: 500, message: ERROR_MESSAGES.InternalServerError })
  }
}

// PATCH /api/settings/admin — upsert a setting, superadmin only
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await checkAuth(true)
    if (!user) {
      return constructResponse({ statusCode: 401, message: ERROR_MESSAGES.AuthenticationError })
    }

    if (user.role !== "superadmin") {
      return constructResponse({ statusCode: 401, message: "Only super admins can update settings" })
    }

    const { key, value, type } = await request.json()

    if (!key || value === undefined || value === null || value === "") {
      return constructResponse({ statusCode: 400, message: ERROR_MESSAGES.BadRequestError })
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value), ...(type ? { type } : {}) },
      create: { key, value: String(value), type: type ?? "string" },
    })

    await AuditService.log({
      adminId: user.id,
      action: "settings_updated",
      targetType: "setting",
      targetId: setting.id,
      description: `Setting "${key}" updated to "${value}"`,
      metadata: { key, value: String(value) },
    })

    return constructResponse({ statusCode: 200, message: "Setting updated", data: setting })
  } catch (error) {
    console.error("[settings/admin PATCH]", error)
    return constructResponse({ statusCode: 500, message: ERROR_MESSAGES.InternalServerError })
  }
}
