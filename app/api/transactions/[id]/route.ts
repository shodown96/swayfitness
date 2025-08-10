import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {

    const { user } = await checkAuth(true)
    const transaction = await prisma.transaction.findUnique({
      where: { id: (await params).id },
    })

    if (!transaction) {
      return constructResponse({
        statusCode: 404,
        message: "Transaction not found",
      })
    }

    return constructResponse({
      statusCode: 200,
      data: transaction,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError
    })
  }
}
