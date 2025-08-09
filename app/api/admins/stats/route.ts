import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { AccountRole, AccountStatus } from "@prisma/client"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const [totalAdmins, superAdmins, activeAdmins] = await Promise.all([
        prisma.account.count({ where: { role: { not: AccountRole.member } } }),
        prisma.account.count({ where: { role: AccountRole.superadmin, } }),
        prisma.account.count({ where: { status: AccountStatus.active, role: { not: AccountRole.member } } }),
    ])

    return constructResponse({
        statusCode: 200,
        data: {
            totalAdmins,
            superAdmins,
            activeAdmins,
        },
    })
}