import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const planId = searchParams.get("planId") || "all"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  if (!page || !limit || page < 1 || limit < 1) {
    return constructResponse({
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }

  const where: any = {
    ...(status !== "all" && { plan: { status } }),
    ...(planId !== "all" && { planId }),
    ...(search && {
      OR: [
        { member: { name: { contains: search, mode: "insensitive" } } },
        { plan: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
  }

  const [total, subscriptions] = await Promise.all([
    prisma.subscription.count({ where }),
    prisma.subscription.findMany({
      where,
      include: {
        account: true,
        plan: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ])

  return constructResponse({
    statusCode: 200,
    data: paginateItems({
      page,
      pageSize: limit,
      items: subscriptions,
      total,
    }),
  })
}
