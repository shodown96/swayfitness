import { checkAuth } from "@/actions/auth/check-auth"
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
export async function POST(request: NextRequest) {
    try {

        // Parse request body
        const { reference, registrationData }: RouteBodyParams = await request.json()
        if (!reference) {
            return constructResponse({
                statusCode: 400,
                message: ERROR_MESSAGES.BadRequestError
            })
        }

        // Verify Transaction
        const result = await PaystackService.verifyTransaction(reference)
        if (!result.status) {
            return constructResponse({
                statusCode: 400,
                message: ERROR_MESSAGES.BadRequestError
            })
        }

        // Check for metadata and other fields
        const planCode = result.data.plan_object.plan_code || result.data.plan
        console.log("[api] /transactions/verify", result.data.metadata, "plan", planCode)
        let accessToken = ""

        // Fetch or create account based on availability of registrationData
        let account = await prisma.account.findUnique({
            where: { email: result.data.customer.email }
        })

        if (!account && !registrationData) {
            return constructResponse({
                statusCode: 400,
                message: ERROR_MESSAGES.BadRequestError
            })
        }

        if (!account && registrationData) {
            const { confirmPassword, password, agreeToTerms, planId, dob, startDate, ...values } = registrationData
            const hashedPassword = await hashPassword(password)
            account = await prisma.account.create({
                data: {
                    ...values,
                    dob: (new Date(dob)).toISOString(),
                    password: hashedPassword,
                    memberId: generateMemberId(),
                    email: result.data.customer.email
                },
                include: {
                    subscription: true,
                }
            })
            accessToken = await generateAccessToken(account)

            const cookieStore = await cookies()
            cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 DAY
                secure: process.env.NODE_ENV === "development" ? false : true,
                sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
                path: "/",
                domain: DOMAIN
            })
        }

        // Register the subscription
        const plan = await prisma.plan.findUnique({
            where: { code: planCode }
        })

        if (plan) {
            const subscription = await prisma.subscription.create({
                data: {
                    plan: { connect: { code: planCode } },
                    account: { connect: { email: result.data.customer.email } },
                    customerCode: result.data.customer.customer_code,
                    customerId: String(result.data.customer.id),
                    startDate: registrationData?.startDate ? (new Date(registrationData?.startDate)).toISOString() : new Date(),
                    nextBillingDate: registrationData?.startDate ? PaystackService.getNextBillingDate(new Date(registrationData?.startDate), plan.interval) : undefined,
                    amount: result.data.amount / 100,
                },
                include: { plan: true }
            })
            const fetchedSubs = await PaystackService.fetchSubscriptionByPlanCodeNCustomer(String(plan.apiId), result.data.customer.id)
            const sub = fetchedSubs.data?.[0]

            if (sub?.id) {
                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        subscriptionCode: sub.subscription_code,
                        emailToken: sub.email_token,
                        nextBillingDate: new Date(sub.next_payment_date.replace(" ", "T")),
                    }
                })
            }

            await prisma.transaction.create({
                data: {
                    account: { connect: { id: account?.id } },
                    amount: result.data.amount / 100,
                    totalAmount: result.data.amount / 100,
                    type: TransactionType.subscription,
                    description: `First month subscription`,
                    status: TransactionStatus.success,
                    reference: reference,
                    subscription: { connect: { id: subscription.id } }
                }
            })
        }

        // If it is a registration transaction, change the registration fee too
        if (registrationData && account) {
            const firstPayment = await PaystackService.chargeAuthorization({
                email: account.email,
                amount: Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE) * 100,
                authorizationCode: result.data.authorization.authorization_code
            })
            await prisma.transaction.create({
                data: {
                    account: { connect: { id: account.id } },
                    amount: firstPayment.data.amount / 100,
                    totalAmount: firstPayment.data.amount / 100,
                    type: TransactionType.registration,
                    description: `Registration`,
                    status: TransactionStatus.success,
                    reference: firstPayment.data.reference,
                }
            })
        }

        const { user } = await checkAuth()


        return constructResponse({
            statusCode: 200,
            data: {
                user,
                accessToken
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
