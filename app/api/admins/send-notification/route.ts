import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { EmailService } from "@/lib/services/email.service"
import { AuditService } from "@/lib/services/audit.service"
import { AccountRole, AccountStatus, SubscriptionStatus } from "@prisma/client"
import { NextRequest } from "next/server"

/** How many emails to fire concurrently. Keeps Brevo rate limits safe. */
const BATCH_SIZE = 10

async function sendInBatches(
  members: { name: string; email: string }[],
  title: string,
  message: string,
) {
  let sent = 0
  let failed = 0

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(
      batch.map((member) =>
        EmailService.sendHTML({
          email: member.email,
          subject: title,
          params: {
            name: member.name,
            title,
            message,
          },
          emailType: "notification",
        }),
      ),
    )

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        sent++
      } else {
        failed++
      }
    }
  }

  return { sent, failed }
}

export async function POST(request: NextRequest) {
  try {
    // Auth: admin or superadmin only
    const { user } = await checkAuth(true)
    if (!user) {
      return constructResponse({ statusCode: 401, message: ERROR_MESSAGES.AuthenticationError })
    }

    // Validate body

    const body = await request.json()
    const { title, message, target = "all" } = body as {
      title: string
      message: string
      target?: "all" | "active" | "inactive"
    }

    if (!title?.trim() || !message?.trim()) {
      return constructResponse({
        statusCode: 400,
        message: "Title and message are required",
      })
    }

    // Fetch target members

    // "active"   → subscription is currently active
    // "inactive" → subscription is cancelled, expired, or suspended
    // "all"      → all active accounts regardless of subscription state
    const subscriptionWhere =
      target === "active"
        ? { subscription: { status: SubscriptionStatus.active } }
        : target === "inactive"
          ? {
              subscription: {
                status: {
                  in: [
                    SubscriptionStatus.cancelled,
                    SubscriptionStatus.expired,
                    SubscriptionStatus.suspended,
                  ],
                },
              },
            }
          : {}

    const members = await prisma.account.findMany({
      where: {
        role: AccountRole.member,
        status: AccountStatus.active,
        ...subscriptionWhere,
      },
      select: { name: true, email: true },
    })

    if (members.length === 0) {
      return constructResponse({
        statusCode: 200,
        message: "No members matched the selected audience. No emails sent.",
        data: { sent: 0, failed: 0, total: 0 },
      })
    }

    // Send emails in batches

    const { sent, failed } = await sendInBatches(members, title.trim(), message.trim())

    await AuditService.log({
      adminId: user!.id,
      action: "notification_sent",
      targetType: "notification",
      description: `Mass notification sent to ${target} audience: "${title}" — ${sent}/${members.length} delivered`,
      metadata: { title, target, sent, failed, total: members.length },
    })

    return constructResponse({
      statusCode: 200,
      message: `Notification sent. ${sent} delivered, ${failed} failed.`,
      data: { sent, failed, total: members.length },
    })
  } catch (error) {
    console.error("[send-notification]", error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
