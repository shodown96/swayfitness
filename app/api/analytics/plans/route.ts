import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await checkAuth(true)
    const plans = await prisma.plan.findMany({
      where: { status: 'active' },
      include: {
        _count: { select: { subscriptions: true } }
      }
    })
    return constructResponse({
      statusCode: 200,
      data: { plans },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
