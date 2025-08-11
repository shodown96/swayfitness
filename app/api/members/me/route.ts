import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { AccountRole, Gender } from "@prisma/client"
import { constructResponse } from "@/lib/response"
import { checkAuth } from "@/actions/auth/check-auth"
import { ProfileUpdateParamsType } from "@/lib/validations"
import { APIRouteIDParams } from "@/types/common"

// GET /api/members/me/
export async function GET(request: NextRequest) {
  try {
    const { user } = await checkAuth()

    return constructResponse({
      statusCode: 200,
      data: { user }
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }
}


// PUT /api/members/me/:id
export async function PUT(
  request: NextRequest
) {
  try {
    const { user } = await checkAuth()
    const body = await request.json()
    const {
      name,
      email,
      phone,
      dob,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship, }: ProfileUpdateParamsType = body

    const existingMember = await prisma.account.findUnique({
      where: { id: user?.id },
    })

    if (!existingMember || existingMember.role !== AccountRole.member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    // Check if the email is already taken by another account
    if (email && email !== existingMember.email) {
      const emailExists = await prisma.account.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: user?.id },
        },
      })

      if (emailExists) {
        return constructResponse({
          statusCode: 400,
          message: "Email already exists",
        })
      }
    }

    const updatedMember = await prisma.account.update({
      where: { id: user?.id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(dob && { dob: new Date(dob) }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(emergencyContactName && { emergencyContactName }),
        ...(emergencyContactName && { emergencyContactName }),
        ...(emergencyContactPhone && { emergencyContactPhone }),
        ...(emergencyContactRelationship && { emergencyContactRelationship }),
      },
      include: { subscription: { include: { plan: true } } },
      omit: { password: true }
    })


    return constructResponse({
      statusCode: 200,
      message: "Member updated successfully",
      data: { user: updatedMember },
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: "Invalid request data",
    })
  }
}

// DELETE /api/members/me/:id
export async function DELETE(
  request: NextRequest
) {
  try {

    const { user } = await checkAuth()
    const existingMember = await prisma.account.findUnique({
      where: { id: user?.id },
    })

    if (!existingMember || existingMember.role !== AccountRole.member) {
      return constructResponse({
        statusCode: 404,
        message: "Member not found",
      })
    }

    await prisma.account.delete({
      where: { id: user?.id },
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
