import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountRole, AccountStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const [totalMembers, activeMembers, inactiveMembers, suspendedMembers] = await Promise.all([
      prisma.account.count({
        where: { role: AccountRole.member },
      }),
      prisma.account.count({
        where: {
          role: AccountRole.member,
          status: AccountStatus.active,
        },
      }),
      prisma.account.count({
        where: {
          role: AccountRole.member,
          status: AccountStatus.inactive,
        },
      }),
      prisma.account.count({
        where: {
          role: AccountRole.member,
          status: AccountStatus.suspended,
        },
      }),
    ])

    return constructResponse({
      statusCode: 200,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        suspendedMembers,
      },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: "Failed to fetch member stats",
    })
  }
}
