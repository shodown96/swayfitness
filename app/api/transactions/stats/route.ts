import { checkAuth } from "@/actions/auth/check-auth"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { user } = await checkAuth(true)
  if (user?.role !== 'superadmin') {
    return constructResponse({
      statusCode: 401,
      message: "Only super admins have access to this resource",
    })
  }
  const [totalTransactions, successfulTransactions, failedTransactions, pendingTransactions, refundedTransactions, totalRevenueData] = await Promise.all([
    prisma.transaction.count(),
    prisma.transaction.count({ where: { status: "success" } }),
    prisma.transaction.count({ where: { status: "failed" } }),
    prisma.transaction.count({ where: { status: "pending" } }),
    prisma.transaction.count({ where: { status: "refunded" } }),
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "success",
        type: { not: 'refund' },
      },
    }),
  ])

  const totalRevenue = totalRevenueData._sum.amount || 0

  return constructResponse({
    statusCode: 200,
    data: {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      refundedTransactions,
      totalRevenue,
    },
  })
}
