import { checkAuth } from "@/actions/auth/check-auth"
import { getManageLink } from "@/actions/paystack/manage-subscriptions"
import { ACCESS_TOKEN_NAME, generateAccessToken } from "@/lib/auth"
import { hashPassword } from "@/lib/bcrypt"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { DOMAIN } from "@/lib/constants/paths"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { generateMemberId } from "@/lib/utils"
import { MemberRegistrationParamsType } from "@/lib/validations"
import { TransactionStatus, TransactionType } from "@prisma/client"
import { cookies } from "next/headers"
import { type NextRequest } from "next/server"
interface RouteBodyParams {
    reference: string,
    registrationData?: MemberRegistrationParamsType
}
export async function GET(request: NextRequest) {
    try {

        const link = await getManageLink()

        return constructResponse({
            statusCode: 200,
            data: {
                link,
            }
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            statusCode: 500,
            message: ERROR_MESSAGES.InternalServerError
        })
    }
}
