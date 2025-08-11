import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { APIRouteIDParams } from "@/types/common"
import { checkAuth } from "@/actions/auth/check-auth"
import PaystackService from "@/lib/services/paystack.service"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkAuth(true)
    const { refundReason, amount } = await request.json()
    if (user?.role !== 'superadmin') {
      return constructResponse({
        statusCode: 401,
        message: "Only super admins have access to this resource",
      })
    }
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: (await params).id },
    })

    if (!transaction) {
      return constructResponse({
        statusCode: 404,
        message: "Transaction not found",
      })
    }

    if (transaction.status === "refunded") {
      return constructResponse({
        statusCode: 400,
        message: "Transaction already refunded",
      })
    }

    if (transaction.status !== "success") {
      return constructResponse({
        statusCode: 400,
        message: "Only successful transactions can be refunded",
      })
    }

    const result = await PaystackService.createRefund(transaction.reference, amount, refundReason)

    if (result.status) {
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "refunded",
          description: `${transaction.description} (Refunded: ${reason})`,
        },
      })

      const refundTransaction = await prisma.transaction.create({
        data: {
          accountId: transaction.accountId,
          amount: transaction.amount,
          status: "success",
          type: "refund",
          reference: `REF_${transaction.reference}`,
          description: `Refund for ${transaction.reference}`,
        },
      })
      return constructResponse({
        statusCode: 200,
        message: "Transaction refunded successfully",
        data: {
          originalTransaction: updatedTransaction,
          refundTransaction,
        },
      })
    }
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
