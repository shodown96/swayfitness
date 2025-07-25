import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { APIRouteIDParams } from "@/types/common"

export async function GET(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const plan = await prisma.plan.findUnique({
    where: { id: (await params).id },
  })

  if (!plan) {
    return constructResponse({
      statusCode: 404,
      message: "Plan not found",
    })
  }

  return constructResponse({
    statusCode: 200,
    data: plan,
  })
}

export async function PUT(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  try {
    const body = await request.json()
    const { name, description, price, interval, features, status } = body

    const existingPlan = await prisma.plan.findUnique({ where: { id: (await params).id } })

    if (!existingPlan) {
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

    const updatedPlan = await prisma.plan.update({
      where: { id: (await params).id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(interval && { interval }),
        ...(features && { features: features.filter((f: string) => f.trim() !== "") }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
    })

    return constructResponse({
      statusCode: 200,
      data: updatedPlan,
      message: "Plan updated successfully",
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  await new Promise((resolve) => setTimeout(resolve, 400))

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

  await prisma.plan.delete({ where: { id: (await params).id } })

  return constructResponse({
    statusCode: 200,
    message: "Plan deleted successfully",
  })
}
