import { checkNormalAuth } from "@/actions/auth/check-normal-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { AuditService } from "@/lib/services/audit.service"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    // Auth guard must run before any DB access
    const { user } = await checkNormalAuth()
    if (!user) {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.AuthenticationError,
      })
    }

    const subscriptionId = (await params).id
    const { cancellationReason } = await request.json()

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      return constructResponse({
        statusCode: 404,
        message: ERROR_MESSAGES.NotFoundError,
      })
    }

    if (!subscription.subscriptionCode || !subscription.emailToken) {
      return constructResponse({
        statusCode: 400,
        message: "Subscription doesn't have a Paystack subscription code",
      })
    }

    // Members can only cancel their own subscription; superadmins can cancel any
    if (subscription.accountId !== user.id && user.role !== "superadmin") {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.AuthenticationError,
      })
    }

    if (subscription.status === "cancelled") {
      return constructResponse({
        statusCode: 400,
        message: "Subscription is already cancelled",
      })
    }

    const result = await PaystackService.disableSubscription(
      subscription.subscriptionCode,
      subscription.emailToken
    )

    if (!result.status) {
      return constructResponse({
        statusCode: 500,
        message: ERROR_MESSAGES.InternalServerError,
      })
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "cancelled",
        cancellationDate: new Date(),
        cancellationReason: cancellationReason ?? null,
      },
    })

    // Only log when an admin cancels on behalf of a member
    if (user.role === "superadmin" || user.role === "admin") {
      await AuditService.log({
        adminId: user.id,
        action: "subscription_cancelled",
        targetType: "subscription",
        targetId: subscriptionId,
        description: `Subscription ${subscription.subscriptionCode ?? subscriptionId} cancelled on behalf of member`,
        metadata: { cancellationReason: cancellationReason ?? null, memberId: subscription.accountId },
      })
    }

    return constructResponse({
      statusCode: 200,
      message: "Subscription cancelled successfully",
    })
  } catch (error) {
    console.error("[cancel-subscription]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
