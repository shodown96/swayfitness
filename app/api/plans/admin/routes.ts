import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { checkAuth } from "@/actions/auth/check-auth"

export async function GET(request: NextRequest) {
  const { user } = await checkAuth(true)
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.toLowerCase()
  const status = searchParams.get("status")
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

  if (status && status !== "all") {
    filters.status = status
  }

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
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    const body = await request.json()
    const { name, description, price, interval, features, status } = body

    if (!name || !description || !price || !interval || !features) {
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

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price: Number(price),
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
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }
}
