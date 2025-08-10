import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import PaystackService from "@/lib/services/paystack.service"
import { PlanStatus } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.toLowerCase()
  const interval = searchParams.get("interval")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  const filters: any = {}

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  filters.status = PlanStatus.active

  if (interval && interval !== "all") {
    filters.interval = interval
  }

  const [total, plans] = await Promise.all([
    prisma.plan.count({ where: filters }),
    prisma.plan.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { subscriptions: true } } }
    }),
  ])

  return constructResponse({
    statusCode: 200,
    data: paginateItems({ page, pageSize: limit, items: plans, total }),
  })
}

export async function POST(request: NextRequest) {
  try {

    const { user } = await checkAuth(true)
    const body = await request.json()
    const { name, description, amount, interval, features, status } = body

    if (!name || !description || !amount || !interval || !features) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }

    const existing = await prisma.plan.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    })

    if (existing) {
      return constructResponse({
        statusCode: 400,
        message: "Plan name already exists",
      })
    }


    const apiCreated = await PaystackService.createPlan({
      name,
      amount: amount * 100,
      interval,
      description
    })

    if (!apiCreated.status) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        apiId: String(apiCreated.data.id),
        description,
        amount: Number(amount),
        interval,
        features: features.filter((f: string) => f.trim() !== ""),
        status: status || "active",
      },
    })

    return constructResponse({
      statusCode: 201,
      message: "Plan created successfully",
      data: plan,
    })
  } catch {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
