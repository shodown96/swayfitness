import { checkAuth } from "@/actions/auth/check-auth"
import { generateRandomPassword } from "@/lib/auth"
import { hashPassword } from "@/lib/bcrypt"
import { APP_NAME } from "@/lib/constants/app"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { originURL } from "@/lib/constants/paths"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { EmailService } from "@/lib/services/email.service"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user } = await checkAuth(true)
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

    if (user?.role !== 'superadmin') {
      return constructResponse({
        statusCode: 401,
        message: "Only super admins can invite others",
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

    const account = await prisma.account.create({
      data: {
        name,
        email,
        phone,
        role,
        password: hashedPassword
      }
    })

    await EmailService.sendHTML({
      emailType: 'newAdmin',
      subject: `Welcome to the ${APP_NAME} Team`,
      email: account.email,
      params: {
        email: account.email,
        name: account.name,
        password: account.password,
        url: `${originURL}/admin/sign-in`
      }
    })

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
