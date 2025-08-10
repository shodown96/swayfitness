import { checkAuth } from "@/actions/auth/check-auth"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountRole, PlanStatus } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { user } = await checkAuth(true)
  const [totalPlans, activePlans, totalMembers, averagePrice] = await Promise.all([
    prisma.plan.count(),
    prisma.plan.count({ where: { status: PlanStatus.active } }),
    prisma.account.count({ where: { role: AccountRole.member } }),
    prisma.plan.aggregate({ _avg: { amount: true } }),
  ])

  return constructResponse({
    statusCode: 200,
    data: {
      totalPlans,
      activePlans,
      totalMembers,
      averagePrice: Math.round(Number(averagePrice._avg.amount || 0)),
    },
  })
}
