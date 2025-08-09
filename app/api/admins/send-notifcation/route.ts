import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { constructResponse } from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { user } = await checkAuth(true)
        const {title, message} = await request.json()
        // TODO: Implement

        return constructResponse({
            statusCode: 200,
            message:'Message sent successfuly (TODO)'
        })
    } catch (error) {
        return constructResponse({
            statusCode: 400,
            message: ERROR_MESSAGES.BadRequestError,
        })
    }
}
