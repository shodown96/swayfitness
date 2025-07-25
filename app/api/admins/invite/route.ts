import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return constructResponse({
        statusCode: 400,
        message: "Missing required fields",
      })
    }

    const lowerEmail = email.toLowerCase()

    const existing = await prisma.account.findUnique({
      where: { email: lowerEmail },
    })

    if (existing) {
      return constructResponse({
        statusCode: 400,
        message: "User with this email already exists",
      })
    }

    // TODO: Optionally save invite token, expiration, etc.
    // Simulate invitation email sending
    // await sendInviteEmail({ email: lowerEmail, role })

    return constructResponse({
      statusCode: 200,
      message: `Invitation sent to ${lowerEmail} for ${role} role`,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }
}
