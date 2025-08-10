import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  try {
    const { user } = await checkAuth(true)
    const plan = await prisma.plan.findUnique({
      where: { id: (await params).id },
    })

    if (!plan) {
      return constructResponse({
        statusCode: 404,
        message: ERROR_MESSAGES.NotFoundError,
      })
    }

    return constructResponse({
      statusCode: 200,
      data: plan,
    })
  } catch (error) {

    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {

  try {
    const { user } = await checkAuth(true)
    const body = await request.json()
    const { name, description, amount, interval, features, status } = body

    const existingPlan = await prisma.plan.findUnique({ where: { id: (await params).id } })

    if (!existingPlan) {
      return constructResponse({
        statusCode: 404,
        message: "Plan not found",
      })
    }


    if (!existingPlan.code) {
      return constructResponse({
        statusCode: 404,
        message: "Plan not found",
      })
    }

    if (name && name !== existingPlan.name) {
      const nameConflict = await prisma.plan.findFirst({
        where: {
          name: name,
          NOT: { id: (await params).id },
        },
      })

      if (nameConflict) {
        return constructResponse({
          statusCode: 400,
          message: "Plan name already exists",
        })
      }
    }

    const apiUpdated = await PaystackService.updatePlan(existingPlan.code, {
      name,
      interval,
      description: description,
      amount: amount ? amount * 100 : undefined,
    })
    if (!apiUpdated.status) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }
    const updatedPlan = await prisma.plan.update({
      where: { id: (await params).id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(amount && { amount: Number(amount) }),
        ...(interval && { interval }),
        ...(features && { features: features.filter((f: string) => f.trim() !== "") }),
        ...(status && { status }),
      },
    })

    return constructResponse({
      statusCode: 200,
      data: updatedPlan,
      message: "Plan updated successfully",
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  const { user } = await checkAuth(true)
  const plan = await prisma.plan.findUnique({
    where: { id: (await params).id },
    include: {
      _count: { select: { subscriptions: true } }
    }
  })

  if (!plan) {
    return constructResponse({
      statusCode: 404,
      message: "Plan not found",
    })
  }

  if (plan._count.subscriptions) {
    return constructResponse({
      statusCode: 400,
      message: `Cannot delete plan with ${plan._count.subscriptions} active members`,
    })
  }


  if (!plan.apiId) {
    return constructResponse({
      statusCode: 404,
      message: "Plan not found",
    })
  }

  await PaystackService.deletePlan(plan.apiId)
  await prisma.plan.delete({ where: { id: plan.id } })


  return constructResponse({
    statusCode: 200,
    message: "Plan deleted successfully",
  })
}
