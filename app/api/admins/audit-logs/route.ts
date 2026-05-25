import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { constructResponse, paginateItems } from "@/lib/response"
import { AuditService } from "@/lib/services/audit.service"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { user } = await checkAuth(true)
    if (!user) {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.AuthenticationError,
      })
    }

    const { searchParams } = new URL(request.url)
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")))

    const { total, logs } = await AuditService.getLogs(page, limit)

    return constructResponse({
      statusCode: 200,
      data: paginateItems({ page, pageSize: limit, items: logs, total }),
    })
  } catch (error) {
    console.error("[audit-logs]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
