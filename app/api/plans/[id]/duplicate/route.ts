import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { PlanStatus } from "@prisma/client"
import { APIRouteIDParams } from "@/types/common"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams,
) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const originalPlan = await prisma.plan.findUnique({
    where: { id: (await params).id },
  })

  if (!originalPlan) {
    return constructResponse({
      statusCode: 404,
      message: "Plan not found",
    })
  }

  // Generate unique name
  let duplicateName = `${originalPlan.name} (Copy)`
  let counter = 1
  while (
    await prisma.plan.findFirst({
      where: { name: duplicateName },
    })
  ) {
    duplicateName = `${originalPlan.name} (Copy ${counter})`
    counter++
  }

  const duplicatedPlan = await prisma.plan.create({
    data: {
      name: duplicateName,
      description: originalPlan.description,
      price: originalPlan.price,
      interval: originalPlan.interval,
      features: originalPlan.features,
      status: PlanStatus.inactive,
    },
  })

  return constructResponse({
    statusCode: 200,
    data: duplicatedPlan,
    message: "Plan duplicated successfully",
  })
}
