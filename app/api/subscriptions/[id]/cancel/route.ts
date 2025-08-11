import { checkNormalAuth } from "@/actions/auth/check-normal-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkNormalAuth()
    const subscriptionId = (await params).id
    const { cancellationReason } = await request.json()
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    })
    if (!user) {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.AuthenticationError,
      })
    }
    if (!subscription) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.NotFoundError,
      })
    }
    if (!subscription.subscriptionCode || !subscription.emailToken) {
      return constructResponse({
        statusCode: 400,
        message: "Subscription doesn't have subscription code",
      })
    }

    if (subscription.accountId !== user.id && user.role !== 'superadmin') {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.AuthenticationError,
      })
    }

    const result = await PaystackService.disableSubscription(subscription.subscriptionCode, subscription.emailToken)
    if (result.status) {
      const subscription = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          cancellationDate: new Date,
          cancellationReason
        }
      })
      return constructResponse({
        statusCode: 200,
        message: "Subscription has been disabled successfully"
      })

    }

    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  } catch (error) {
    console.log(error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
