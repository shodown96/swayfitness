import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { APIRouteIDParams } from "@/types/common"
import { checkAuth } from "@/actions/auth/check-auth"
import PaystackService from "@/lib/services/paystack.service"
import { AuditService } from "@/lib/services/audit.service"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkAuth(true)

    if (user?.role !== "superadmin") {
      return constructResponse({
        statusCode: 401,
        message: "Only super admins have access to this resource",
      })
    }

    // Parse body once — previously called request.json() twice which empties the stream
    const { refundReason, amount } = await request.json()

    if (!refundReason) {
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

    // amount is optional — if omitted Paystack refunds the full transaction amount.
    // The service layer converts naira → kobo if an amount is provided.
    const result = await PaystackService.createRefund(
      transaction.reference,
      amount ?? undefined,
      refundReason
    )

    if (!result.status) {
      return constructResponse({
        statusCode: 500,
        message: ERROR_MESSAGES.InternalServerError,
      })
    }

    // Paystack refund id stored so we can poll /refund/:id for status changes later
    const refundedAmount = amount ?? Number(transaction.amount)

    const [updatedTransaction, refundTransaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "refunded",
          refundReason,
          refundDate: new Date(),
          refundApiId: String(result.data.id),
          description: `${transaction.description} (Refunded: ${refundReason})`,
        },
      }),
      prisma.transaction.create({
        data: {
          accountId: transaction.accountId,
          subscriptionId: transaction.subscriptionId ?? undefined,
          amount: refundedAmount,
          totalAmount: refundedAmount,
          status: "success",
          type: "refund",
          // Paystack refund reference sits inside result.data.transaction.reference;
          // prefix with REF_ to make it unique in our table if that reference already exists.
          reference: `REF_${transaction.reference}`,
          description: `Refund for ${transaction.reference}: ${refundReason}`,
        },
      }),
    ])

    await AuditService.log({
      adminId: user!.id,
      action: "refund_issued",
      targetType: "transaction",
      targetId: transaction.id,
      description: `Refund of ${refundedAmount > 0 ? `₦${refundedAmount.toLocaleString()}` : "full amount"} issued for transaction ${transaction.reference}`,
      metadata: { refundReason, amount: refundedAmount, reference: transaction.reference },
    })

    return constructResponse({
      statusCode: 200,
      message: "Refund initiated successfully",
      data: {
        originalTransaction: updatedTransaction,
        refundTransaction,
      },
    })
  } catch (error) {
    console.error("[refund]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
