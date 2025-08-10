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

const allowedRoles: AccountRole[] = [
    AccountRole.admin,
    AccountRole.superadmin,
]


// GET /api/members/[id]
export async function GET(
    request: NextRequest,
    { params }: APIRouteIDParams
) {
    try {
        await checkAuth(true)
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
                message: "Admin not found",
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
            role,
            status,
        } = body

        const existingAdmin = await prisma.account.findUnique({
            where: { id: (await params).id },
        })

        if (!existingAdmin || existingAdmin.role === AccountRole.member) {
            return constructResponse({
                statusCode: 404,
                message: "Admin not found",
            })
        }

        // Check for email conflict
        if (email && email !== existingAdmin.email) {
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


        // check for correct role
        if (role && !allowedRoles.includes(role)) {
            return constructResponse({
                statusCode: 400,
                message: "Invalid role provided",
            })
        }

        const updatedAdmin = await prisma.account.update({
            where: { id: (await params).id },
            data: {
                ...(name && { name }),
                ...(email && { email: email.toLowerCase() }),
                ...(phone && { phone }),
                ...(role && { role }),
                ...(status && { status }),
            },
            omit: { password: true }
        })

        return constructResponse({
            statusCode: 200,
            message: "Admin updated successfully",
            data: { member: updatedAdmin },
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
        const existingAdmin = await prisma.account.findUnique({
            where: { id: (await params).id },
        })

        if (!existingAdmin || existingAdmin.role === AccountRole.member) {
            return constructResponse({
                statusCode: 404,
                message: "Admin not found",
            })
        }

        await prisma.account.delete({
            where: { id: (await params).id },
        })

        return constructResponse({
            statusCode: 200,
            message: "Admin deleted successfully",
        })
    } catch (error) {
        return constructResponse({
            statusCode: 500,
            message: ERROR_MESSAGES.InternalServerError,
        })
    }
}
