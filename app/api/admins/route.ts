import { checkAuth } from "@/actions/auth/check-auth"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import { AccountRole, AccountStatus, Prisma } from "@prisma/client"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  await checkAuth(true)
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role")
  const status = searchParams.get("status")
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("limit") || "10")

  const where: Prisma.AccountWhereInput = {
    role: { not: AccountRole.member },
    AND: [
      {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    ],
  }

  if (role && role !== "all") where.role = role as AccountRole
  if (status && status !== "all") where.status = status as AccountStatus

  const [admins, total] = await Promise.all([
    prisma.account.findMany({
      where,
      omit: { password: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.account.count({ where }),
  ])

  const paginated = paginateItems({ page, pageSize, items: admins, total })

  return constructResponse({ statusCode: 200, data: paginated })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role } = body

    if (!name || !email || !role) {
      return constructResponse({
        statusCode: 400,
        message: ERROR_MESSAGES.BadRequestError,
      })
    }

    const existing = await prisma.account.findUnique({ where: { email } })
    if (existing) {
      return constructResponse({
        statusCode: 400,
        message: "Email already exists",
      })
    }

    const newAdmin = await prisma.account.create({
      data: {
        name,
        email,
        role,
        password: String(process.env.GOOD_PASSWORD), // placeholder
      },
      omit: { password: true }
    })

    return constructResponse({
      statusCode: 201,
      message: "Admin created successfully",
      data: newAdmin,
    })
  } catch {
    return constructResponse({
      statusCode: 400,
      message: ERROR_MESSAGES.BadRequestError,
    })
  }
}
