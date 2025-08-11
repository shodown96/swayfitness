import { APP_NAME } from "@/lib/constants/app";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { constructResponse } from "@/lib/response";
import { EmailService } from "@/lib/services/email.service";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const {
            name,
            email,
            phone,
            message
        } = await request.json()

        await EmailService.sendHTML({
            subject: `New contact pmessage from ${APP_NAME}`,
            params: {
                email,
                message,
                phone,
                name,
            },
            emailType: "contact",
        });

        return constructResponse({
            statusCode: 200,
        })

    } catch (error) {
        console.log(error)
        return constructResponse({
            statusCode: 500,
            message: ERROR_MESSAGES.InternalServerError,
        })
    }
}
