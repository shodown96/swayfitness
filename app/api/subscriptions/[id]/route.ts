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
        const { planId } = await request.json()
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId }
        })
        const plan = await prisma.plan.findUnique({
            where: { id: planId }
        })
        if (!user) {
            return constructResponse({
                statusCode: 401,
                message: ERROR_MESSAGES.AuthenticationError,
            })
        }
        if (!subscription || !plan?.code) {
            return constructResponse({
                statusCode: 400,
                message: ERROR_MESSAGES.NotFoundError,
            })
        }
        if (!subscription.subscriptionCode) {
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

        const result = await PaystackService.updateSubscription(subscription, plan.code)
        if (result) {
            const subscription = await prisma.subscription.update({
                where: { id: subscriptionId },
                data: {
                    plan: { connect: { apiId: String(result.data.plan) } },
                    amount: result.data.amount / 100
                }
            })
            return constructResponse({
                statusCode: 200,
                message: "Subscription successfully updated"
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
            message: "The subscription is probably inactive already",
        })
    }
}
