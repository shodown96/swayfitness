import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { AccountRole, AccountStatus } from "@prisma/client"
import { APIRouteIDParams } from "@/types/common"

const allowedStatuses: AccountStatus[] = [
  AccountStatus.active,
  AccountStatus.inactive,
  AccountStatus.suspended,
]

export async function PATCH(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status || !allowedStatuses.includes(status)) {
      return constructResponse({
        statusCode: 400,
        message: "Invalid status",
      })
    }

    const existingMember = await prisma.account.findUnique({
      where: { id: (await params).id },
    })

    if (!existingMember || existingMember.role !== AccountRole.member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    const updatedMember = await prisma.account.update({
      where: { id: (await params).id },
      data: {
        status,
      },
    })

    return constructResponse({
      statusCode: 200,
      message: `Member status updated to ${status.toLowerCase()}`,
      data: updatedMember,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: "Invalid request data",
    })
  }
}
