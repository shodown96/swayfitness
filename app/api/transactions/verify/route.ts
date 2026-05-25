import { ACCESS_TOKEN_NAME, generateAccessToken } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { DOMAIN } from "@/lib/constants/paths"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { generateMemberId } from "@/lib/utils"
import { TransactionStatus, TransactionType } from "@prisma/client"
import { cookies } from "next/headers"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return constructResponse({ statusCode: 400, message: ERROR_MESSAGES.BadRequestError })
    }

    // Verify the transaction with Paystack — this is the source of truth
    const result = await PaystackService.verifyTransaction(reference)
    if (!result.status || result.data.status !== "success") {
      return constructResponse({ statusCode: 400, message: "Payment was not successful" })
    }

    const customerEmail = result.data.customer.email.toLowerCase()

    // Guard against double-processing the same reference
    const existingTx = await prisma.transaction.findUnique({ where: { reference } })
    if (existingTx) {
      // Already processed — just issue a new auth token for the account
      const account = await prisma.account.findUnique({ where: { email: customerEmail } })
      if (account) {
        const accessToken = await generateAccessToken(account)
        await setAuthCookie(accessToken)
        const safeAccount = await prisma.account.findUnique({
          where: { id: account.id },
          include: { subscription: { include: { plan: true } } },
          omit: { password: true },
        })
        return constructResponse({ statusCode: 200, data: { user: safeAccount, accessToken } })
      }
    }

    // Extract metadata we embedded in the Paystack transaction on initialization
    const metadata = result.data.metadata as unknown as {
      pendingId?: string
      planId?: string
      registrationFee?: number
      isNewUser?: boolean
    }

    // Get or create the account
    let account = await prisma.account.findUnique({ where: { email: customerEmail } })

    if (!account) {
      // New member: retrieve the form data we persisted at checkout init time
      if (!metadata.pendingId) {
        return constructResponse({ statusCode: 400, message: "Registration data not found. Please contact support." })
      }

      const pending = await prisma.pendingRegistration.findUnique({
        where: { id: metadata.pendingId },
      })

      if (!pending) {
        return constructResponse({
          statusCode: 400,
          message: "Registration session expired or already used. Please restart the sign-up process.",
        })
      }

      // Destructure safe fields from the stored JSON blob
      const {
        name, phone, dob, gender, address, avatarUrl,
        emergencyContactName, emergencyContactPhone,
        emergencyContactRelationship, medicalConditions,
        startDate: _startDate,
        ..._ // swallow anything unexpected
      } = pending.data as Record<string, string>

      account = await prisma.account.create({
        data: {
          name,
          email: customerEmail,
          phone: phone ?? null,
          dob: dob ? new Date(dob) : null,
          gender: (gender as "male" | "female" | "other") ?? null,
          address: address ?? null,
          avatarUrl: avatarUrl ?? null,
          emergencyContactName: emergencyContactName ?? null,
          emergencyContactPhone: emergencyContactPhone ?? null,
          emergencyContactRelationship: emergencyContactRelationship ?? null,
          medicalConditions: medicalConditions ?? null,
          password: pending.passwordHash,
          memberId: generateMemberId(),
        },
      })

      // Pending record is consumed — delete it
      await prisma.pendingRegistration.delete({ where: { id: pending.id } }).catch(() => {})
    }

    // Resolve plan from the Paystack transaction (plan_object is set when a plan was attached)
    const planCode: string | undefined =
      result.data.plan_object?.plan_code ?? result.data.plan ?? undefined

    const plan = planCode
      ? await prisma.plan.findUnique({ where: { code: planCode } })
      : null

    if (plan) {
      const existingSubscription = await prisma.subscription.findUnique({
        where: { accountId: account.id },
      })

      const subscription = existingSubscription
        ? await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              planId: plan.id,
              status: "active",
              startDate: new Date(),
              amount: plan.amount, // recurring amount — NOT the first-payment total
              customerCode: result.data.customer.customer_code,
              customerId: String(result.data.customer.id),
            },
          })
        : await prisma.subscription.create({
            data: {
              plan: { connect: { id: plan.id } },
              account: { connect: { id: account.id } },
              customerCode: result.data.customer.customer_code,
              customerId: String(result.data.customer.id),
              startDate: new Date(),
              amount: plan.amount, // recurring amount — NOT the first-payment total
            },
          })

      // Fetch the subscription Paystack created so we can capture the code and next billing date
      try {
        const fetchedSubs = await PaystackService.fetchSubscriptionByPlanCodeNCustomer(
          String(plan.apiId),
          result.data.customer.id,
        )
        const sub = fetchedSubs.data?.[0]
        if (sub?.id) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              subscriptionCode: sub.subscription_code,
              emailToken: sub.email_token,
              nextBillingDate: new Date(sub.next_payment_date.replace(" ", "T")),
            },
          })
        }
      } catch {
        // Non-fatal — subscription code can be synced later via webhook
      }

      const registrationFee = metadata.registrationFee ?? 0
      const totalCharged = result.data.amount / 100 // kobo → naira

      // Record the subscription portion of the first payment
      await prisma.transaction.create({
        data: {
          account: { connect: { id: account.id } },
          subscription: { connect: { id: subscription.id } },
          amount: plan.amount,
          totalAmount: totalCharged,
          type: TransactionType.subscription,
          status: TransactionStatus.success,
          reference,
          description: `First ${plan.interval} payment — ${plan.name}`,
        },
      })

      // Record the registration fee as its own line item (if applicable)
      if (metadata.isNewUser && registrationFee > 0) {
        await prisma.transaction.create({
          data: {
            account: { connect: { id: account.id } },
            subscription: { connect: { id: subscription.id } },
            amount: registrationFee,
            totalAmount: registrationFee,
            type: TransactionType.registration,
            status: TransactionStatus.success,
            reference: `REG_${reference}`,
            description: "One-time registration fee",
          },
        })
      }
    }

    // Issue an auth token and set it as an httpOnly cookie
    const accessToken = await generateAccessToken(account)
    await setAuthCookie(accessToken)

    // Return the user without their password
    const safeAccount = await prisma.account.findUnique({
      where: { id: account.id },
      include: { subscription: { include: { plan: true } } },
      omit: { password: true },
    })

    return constructResponse({
      statusCode: 200,
      data: { user: safeAccount, accessToken },
    })
  } catch (error) {
    console.error("[transactions/verify]", error)
    return constructResponse({ statusCode: 500, message: ERROR_MESSAGES.InternalServerError })
  }
}

async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60, // 1 day in seconds
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
    path: "/",
    domain: DOMAIN,
  })
}
