import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { PlanStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const [totalPlans, activePlans, totalMembers, averagePrice] = await Promise.all([
    prisma.plan.count(),
    prisma.plan.count({ where: { status: PlanStatus.active} }),
    prisma.account.count(),
    prisma.plan.aggregate({ _avg: { price: true } }),
  ])

  return constructResponse({
    statusCode: 200,
    data: {
      totalPlans,
      activePlans,
      totalMembers,
      averagePrice: Math.round(Number(averagePrice._avg.price || 0)),
    },
  })
}
