import { generateRandomPassword } from "@/lib/auth"
import { hashPassword } from "@/lib/bcrypt"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      role
    } = body

    if (!email || !role || !name || !phone) {
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
    const password = generateRandomPassword()
    const hashedPassword = await hashPassword(password)

    const created = await prisma.account.create({
      data: {
        name,
        email,
        phone,
        role,
        password: hashedPassword
      }
    })
    
    // TODO: invitation email sending
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
