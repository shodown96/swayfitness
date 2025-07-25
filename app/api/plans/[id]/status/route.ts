import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { PlanStatus } from "@prisma/client"
import { APIRouteIDParams } from "@/types/common"

export async function PATCH(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const plan = await prisma.plan.findUnique({ where: { id: (await params).id } })

  if (!plan) {
    return constructResponse({
      statusCode: 404,
      message: "Plan not found",
    })
  }

  const newStatus = plan.status === PlanStatus.active ? PlanStatus.inactive  : PlanStatus.active 

  const updatedPlan = await prisma.plan.update({
    where: { id: (await params).id },
    data: {
      status: newStatus,
      updatedAt: new Date(),
    },
  })

  return constructResponse({
    statusCode: 200,
    data: updatedPlan,
    message: `Plan ${newStatus === PlanStatus.active  ? "activated" : "deactivated"} successfully`,
  })
}
