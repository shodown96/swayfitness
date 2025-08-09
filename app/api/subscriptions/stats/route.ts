import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountStatus, TransactionType } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const [activeSubscriptions, expiredSubscriptions, suspendedSubscriptions, totalRevenue] = await Promise.all([
    prisma.account.count({ where: { status: AccountStatus.active } }),
    prisma.account.count({ where: { status: AccountStatus.inactive } }),
    prisma.account.count({ where: { status: AccountStatus.suspended } }),
    prisma.transaction.aggregate({ _sum: { totalAmount: true }, where: { type: { not: TransactionType.refund } } }),
  ])

  return constructResponse({
    statusCode: 200,
    data: {
      activeSubscriptions,
      expiredSubscriptions,
      suspendedSubscriptions,
      totalRevenue: totalRevenue._sum.totalAmount
    },
  })
}
