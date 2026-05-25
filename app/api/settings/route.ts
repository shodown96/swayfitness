import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { type NextRequest } from "next/server"

// Keys that are safe to expose to unauthenticated callers (e.g. the join page)
const PUBLIC_KEYS = ["registration_fee"]

/**
 * GET /api/settings
 * Returns public settings. Pass ?key=<key> to fetch a single value.
 * No auth required — only PUBLIC_KEYS are returned.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (key) {
      if (!PUBLIC_KEYS.includes(key)) {
        return constructResponse({
          statusCode: 401,
          message: "Access to this setting is restricted",
        })
      }

      const setting = await prisma.setting.findUnique({ where: { key } })

      if (!setting) {
        return constructResponse({ statusCode: 404, message: "Setting not found" })
      }

      return constructResponse({ statusCode: 200, data: setting })
    }

    const settings = await prisma.setting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    })

    return constructResponse({ statusCode: 200, data: settings })
  } catch (error) {
    console.error("[settings GET]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

/**
 * PATCH /api/settings
 * Update (or create) a setting. Superadmin only.
 * Body: { key: string; value: string; type?: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await checkAuth(true)

    if (!user || user.role !== "superadmin") {
      return constructResponse({
        statusCode: 401,
        message: "Only super admins can update settings",
      })
    }

    const { key, value, type } = await request.json()

    if (!key || value === undefined || value === null) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value), ...(type ? { type } : {}) },
      create: { key, value: String(value), type: type ?? "string" },
    })

    return constructResponse({
      statusCode: 200,
      message: "Setting updated successfully",
      data: setting,
    })
  } catch (error) {
    console.error("[settings PATCH]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
