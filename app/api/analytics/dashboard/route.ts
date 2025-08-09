import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountRole, AccountStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const [totalMembers, activeMembers, transactions, newMembers, activeSubscriptions] = await Promise.all([
    prisma.account.count({ where: { role: AccountRole.member } }),
    prisma.account.count({ where: { role: AccountRole.member, status: AccountStatus.active } }),
    prisma.transaction.findMany({}),
    prisma.account.count({
      where: {
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    }),
    prisma.subscription.count({ where: { status: 'active' } })
  ])

  const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0)

  const monthlyRevenue = transactions
    .filter((txn) => {
      const date = new Date(txn.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, txn) => sum + Number(txn.amount), 0)

  const memberGrowthRate = 12.5 // Simulated
  const revenueGrowthRate = 8.3 // Simulated
  const averageRevenuePerMember = activeMembers > 0 ? Math.round(totalRevenue / activeMembers) : 0

  return constructResponse({
    statusCode: 200,
    data: {
      totalMembers,
      activeMembers,
      totalRevenue,
      monthlyRevenue,
      newMembersThisMonth: newMembers,
      memberGrowthRate,
      revenueGrowthRate,
      averageRevenuePerMember,
      activeSubscriptions,
    },
  })
}
