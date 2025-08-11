import { checkAuth } from "@/actions/auth/check-auth"
import { hashPassword, isPasswordCorrect } from "@/lib/bcrypt"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { user } = await checkAuth(true)

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

export async function PUT(
    request: NextRequest,
) {
    try {
        const { user } = await checkAuth(true)
        if (!user) {
            return constructResponse({
                statusCode: 401,
                message: ERROR_MESSAGES.AuthenticationError,
            })
        }
        const body = await request.json()
        const {
            name,
            email,
            phone,
            password,
            currentPassword,
        } = body

        // Check for email conflict
        if (email && email !== user.email) {
            const emailExists = await prisma.account.findFirst({
                where: {
                    email: email.toLowerCase(),
                    NOT: { id: user.id },
                },
            })

            if (emailExists) {
                return constructResponse({
                    statusCode: 400,
                    message: "Email already exists",
                })
            }
        }

        if (password) {
            const isPass = await isPasswordCorrect(currentPassword, user.password)
            if (!isPass) {
                return constructResponse({
                    statusCode: 401,
                    message: ERROR_MESSAGES.InvalidCredentials,
                })
            }
        }

        const updatedAdmin = await prisma.account.update({
            where: { id: user.id },
            data: {
                ...(name && { name }),
                ...(email && { email: email.toLowerCase() }),
                ...(phone && { phone }),
                ...(password && { password: await hashPassword(password) }),
            },
            omit: { password: true }
        })

        return constructResponse({
            statusCode: 200,
            message: "Admin updated successfully",
            data: { member: updatedAdmin },
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            statusCode: 500,
            message: ERROR_MESSAGES.InternalServerError,
        })
    }
}