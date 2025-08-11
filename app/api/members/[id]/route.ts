import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { APIRouteIDParams } from "@/types/common"
import { AccountRole, AccountStatus } from "@prisma/client"
import { NextRequest } from "next/server"

const allowedStatuses: AccountStatus[] = [
  AccountStatus.active,
  AccountStatus.inactive,
  AccountStatus.suspended,
]


// GET /api/members/[id]
export async function GET(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkAuth(true)
    const member = await prisma.account.findFirst({
      where: {
        id: (await params).id,
        role: AccountRole.member,
      },
      include: { subscription: { include: { plan: true } } },
      omit: { password: true }
    })

    if (!member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    return constructResponse({
      statusCode: 200,
      data: { member },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

// PUT /api/members/[id]
export async function PUT(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkAuth(true)
    const body = await request.json()
    const { name,
      email,
      phone,
      dob,
      gender,
      status,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship
    } = body

    const existingMember = await prisma.account.findUnique({
      where: { id: (await params).id },
    })

    if (!existingMember || existingMember.role !== AccountRole.member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    // Check for email conflict
    if (email && email !== existingMember.email) {
      const emailExists = await prisma.account.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: (await params).id },
        },
      })

      if (emailExists) {
        return constructResponse({
          statusCode: 400,
          message: "Email already exists",
        })
      }
    }

    // check for correct status
    if (status && !allowedStatuses.includes(status)) {
      return constructResponse({
        statusCode: 400,
        message: "Invalid status provided",
      })
    }

    const updatedMember = await prisma.account.update({
      where: { id: (await params).id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(dob && { dob: new Date(dob) }),
        ...(gender && { gender }),
        ...(status && { status }),
        ...(address && { address }),
        ...(emergencyContactName && { emergencyContactName }),
        ...(emergencyContactPhone && { emergencyContactPhone }),
        ...(emergencyContactRelationship && { emergencyContactRelationship }),
      },
      omit: { password: true }
    })

    return constructResponse({
      statusCode: 200,
      message: "Member updated successfully",
      data: { member: updatedMember },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: "Invalid request data",
    })
  }
}

// DELETE /api/members/[id]
export async function DELETE(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  try {
    const { user } = await checkAuth()
    const existingMember = await prisma.account.findUnique({
      where: { id: (await params).id },
    })

    if (!existingMember || existingMember.role !== AccountRole.member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    await prisma.account.delete({
      where: { id: (await params).id },
    })

    return constructResponse({
      statusCode: 200,
      message: "Member deleted successfully",
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
