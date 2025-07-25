import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const [totalSubscriptions, activeSubscriptions, expiredSubscriptions, suspendedSubscriptions] = await Promise.all([
    prisma.account.count(),
    prisma.account.count({ where: { status: AccountStatus.active } }),
    prisma.account.count({ where: { status: AccountStatus.inactive } }),
    prisma.account.count({ where: { status: AccountStatus.suspended } }),
  ])

  return constructResponse({
    statusCode: 200,
    data: {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      suspendedSubscriptions,
    },
  })
}
