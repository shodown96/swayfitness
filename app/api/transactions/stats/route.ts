import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { TransactionStatus } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 300))

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
