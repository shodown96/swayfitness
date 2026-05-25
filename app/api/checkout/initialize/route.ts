import { hashPassword } from "@/lib/bcrypt"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { originURL } from "@/lib/constants/paths"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { MemberRegistrationParamsType } from "@/lib/validations"
import { NextRequest } from "next/server"

// Pending registrations expire after 1 hour
const PENDING_TTL_MS = 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, registrationData } = body as {
      planId: string
      registrationData: MemberRegistrationParamsType
    }

    if (!planId || !registrationData?.email || !registrationData?.password) {
      return constructResponse({ statusCode: 400, message: ERROR_MESSAGES.BadRequestError })
    }

    const email = registrationData.email.toLowerCase().trim()

    // Look up plan in DB — amount and code come from server, never the client
    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan || !plan.code) {
      return constructResponse({ statusCode: 404, message: "Selected plan not found" })
    }

    // Get registration fee from settings (server-side only)
    const feeSetting = await prisma.setting.findUnique({ where: { key: "registration_fee" } })
    const registrationFee = feeSetting ? Number(feeSetting.value) : 0

    // Determine whether this is a new or returning member
    const existingAccount = await prisma.account.findUnique({
      where: { email },
      select: { id: true },
    })
    const isNewUser = !existingAccount

    if (!isNewUser) {
      // Returning member: they already paid the registration fee
      // They should use the member dashboard to manage their subscription instead
      return constructResponse({
        statusCode: 400,
        message: "An account with this email already exists. Please sign in to manage your subscription.",
      })
    }

    // Server-computed total for first payment: plan + one-time registration fee
    const totalAmountNaira = plan.amount + registrationFee

    // Hash password before storing — never store plaintext
    const passwordHash = await hashPassword(registrationData.password)

    // Clean up any expired pending records for this email
    await prisma.pendingRegistration.deleteMany({
      where: { email, expiresAt: { lt: new Date() } },
    })

    // Persist form data so the verify endpoint can create the account
    // without any sensitive data travelling through Paystack's servers
    const { password, confirmPassword, agreeToTerms, planId: _pid, ...safeData } = registrationData
    const pending = await prisma.pendingRegistration.create({
      data: {
        email,
        passwordHash,
        planId: plan.id,
        data: { ...safeData, email }, // JSON blob — no password, no confirmPassword
        expiresAt: new Date(Date.now() + PENDING_TTL_MS),
      },
    })

    // Initialize the Paystack hosted checkout session
    // Amount is NAIRA here; PaystackService.initializeTransaction converts to kobo
    const paystackResult = await PaystackService.initializeTransaction({
      email,
      amount: totalAmountNaira,
      plan: plan.code, // attaches a recurring subscription at plan.amount after first charge
      callback_url: `${originURL}/verify`,
      metadata: {
        pendingId: pending.id,
        planId: plan.id,
        registrationFee,
        isNewUser: true,
      },
    })

    if (!paystackResult.status) {
      // Clean up pending record if Paystack init failed
      await prisma.pendingRegistration.delete({ where: { id: pending.id } }).catch(() => {})
      return constructResponse({ statusCode: 500, message: "Failed to initialize payment. Please try again." })
    }

    return constructResponse({
      statusCode: 200,
      message: "Checkout session created",
      data: { url: paystackResult.data.authorization_url },
    })
  } catch (error) {
    console.error("[checkout/initialize]", error)
    return constructResponse({ statusCode: 500, message: ERROR_MESSAGES.InternalServerError })
  }
}
