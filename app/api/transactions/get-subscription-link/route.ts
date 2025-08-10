import { checkAuth } from "@/actions/auth/check-auth"
import { getManageLink } from "@/actions/paystack/manage-subscriptions"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { constructResponse } from "@/lib/response"
import { MemberRegistrationParamsType } from "@/lib/validations"
import { type NextRequest } from "next/server"
interface RouteBodyParams {
    reference: string,
    registrationData?: MemberRegistrationParamsType
}
export async function GET(request: NextRequest) {
    try {
        const { user } = await checkAuth()
        if (!user) {
            return constructResponse({
                statusCode: 401,
                message: ERROR_MESSAGES.AuthenticationError
            })
        }
        const link = await getManageLink(user)

        return constructResponse({
            statusCode: 200,
            data: { link }
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            statusCode: 500,
            message: ERROR_MESSAGES.InternalServerError
        })
    }
}
