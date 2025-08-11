import { checkAuth } from "@/actions/auth/check-auth"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { SubscriptionStatus, TransactionType } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { user } = await checkAuth(true)
  if (user?.role !== 'superadmin') {
    return constructResponse({
      statusCode: 401,
      message: "Only super admins have access to this resource",
    })
  }
  const [activeSubscriptions, expiredSubscriptions, totalRevenue] = await Promise.all([
    prisma.subscription.count({ where: { status: SubscriptionStatus.active } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.expired } }),
    prisma.transaction.aggregate({ _sum: { totalAmount: true }, where: { type: { not: TransactionType.refund } } }),
  ])

  return constructResponse({
    statusCode: 200,
    data: {
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue: totalRevenue._sum.totalAmount
    },
  })
}
