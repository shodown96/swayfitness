import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountRole, AccountStatus, PlanInterval, TransactionStatus, TransactionType } from "@prisma/client"
import { type NextRequest } from "next/server"

// Normalize any subscription amount to its monthly equivalent (naira).
function normalizeToMonthly(amount: number, interval: PlanInterval): number {
  switch (interval) {
    case PlanInterval.monthly:    return amount
    case PlanInterval.weekly:     return amount * (52 / 12)
    case PlanInterval.daily:      return amount * 30
    case PlanInterval.annually:   return amount / 12
    case PlanInterval.quarterly:  return amount / 3
    case PlanInterval.biannually: return amount / 6
    case PlanInterval.hourly:     return amount * 24 * 30
    default:                      return amount
  }
}

export async function GET(request: NextRequest) {
  try {
    await checkAuth(true)

    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const [
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      newMembersLastMonth,
      activeSubscriptionsWithPlans,
      totalRevenueTxn,
      thisMonthSubRevenue,
      lastMonthSubRevenue,
    ] = await Promise.all([
      prisma.account.count({
        where: { role: AccountRole.member },
      }),

      prisma.account.count({
        where: { role: AccountRole.member, status: AccountStatus.active },
      }),

      // New member registrations this calendar month
      prisma.account.count({
        where: {
          role: AccountRole.member,
          createdAt: { gte: startOfThisMonth, lt: startOfNextMonth },
        },
      }),

      // New member registrations last calendar month (for growth rate)
      prisma.account.count({
        where: {
          role: AccountRole.member,
          createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
      }),

      // Active subscriptions with plan interval — used to compute MRR
      prisma.subscription.findMany({
        where: { status: "active" },
        select: { amount: true, plan: { select: { interval: true } } },
      }),

      // All-time revenue: successful subscription + registration transactions only
      prisma.transaction.aggregate({
        where: {
          status: TransactionStatus.success,
          type: { in: [TransactionType.subscription, TransactionType.registration] },
        },
        _sum: { amount: true },
      }),

      // Subscription payments collected this calendar month
      prisma.transaction.aggregate({
        where: {
          type: TransactionType.subscription,
          status: TransactionStatus.success,
          createdAt: { gte: startOfThisMonth, lt: startOfNextMonth },
        },
        _sum: { amount: true },
      }),

      // Subscription payments collected last calendar month (for revenue growth rate)
      prisma.transaction.aggregate({
        where: {
          type: TransactionType.subscription,
          status: TransactionStatus.success,
          createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
        _sum: { amount: true },
      }),
    ])

    const activeSubscriptions = activeSubscriptionsWithPlans.length

    // MRR: sum each active subscription's amount normalized to a monthly equivalent
    const mrr = activeSubscriptionsWithPlans.reduce((sum, sub) => {
      return sum + normalizeToMonthly(Number(sub.amount), sub.plan.interval)
    }, 0)

    const totalRevenue = Number(totalRevenueTxn._sum.amount ?? 0)
    const thisMonthRev = Number(thisMonthSubRevenue._sum.amount ?? 0)
    const lastMonthRev = Number(lastMonthSubRevenue._sum.amount ?? 0)

    // Month-over-month growth rates (percentage, 1 decimal place)
    const revenueGrowthRate =
      lastMonthRev > 0
        ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 1000) / 10
        : 0

    const memberGrowthRate =
      newMembersLastMonth > 0
        ? Math.round(((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth) * 1000) / 10
        : newMembersThisMonth > 0 ? 100 : 0

    // ARPU: MRR per active subscriber
    const averageRevenuePerMember =
      activeSubscriptions > 0 ? Math.round(mrr / activeSubscriptions) : 0

    return constructResponse({
      statusCode: 200,
      data: {
        totalMembers,
        activeMembers,
        totalRevenue,
        monthlyRevenue: Math.round(mrr),
        newMembersThisMonth,
        memberGrowthRate,
        revenueGrowthRate,
        averageRevenuePerMember,
        activeSubscriptions,
      },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
