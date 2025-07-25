import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { AccountRole, AccountStatus, Gender, PlanInterval } from "@prisma/client"
import { hashPassword } from "@/lib/bcrypt"

// GET /api/members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const planId = searchParams.get("plan")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {
      role: AccountRole.member,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { memberId: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== "all" && { status: status.toUpperCase() as AccountStatus }),
      ...(planId && planId !== "all" && {
        subscription: { planId },
      }),
    }

    const [members, total] = await Promise.all([
      prisma.account.findMany({
        where,
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.account.count({ where }),
    ])

    const paginated = paginateItems({
      page,
      pageSize: limit,
      total,
      items: members,
    })

    return constructResponse({
      statusCode: 200,
      data: paginated,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

// POST /api/members
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, dob, gender, planId, password } = body

    if (!name || !email || !phone || !dob || !gender || !planId || !password) {
      return constructResponse({
        statusCode: 400,
        message: "Missing required fields",
      })
    }

    const existingMember = await prisma.account.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingMember) {
      return constructResponse({
        statusCode: 400,
        message: "Email already exists",
      })
    }

    const totalMembers = await prisma.account.count({
      where: { role: AccountRole.member },
    })

    const memberId = `GYM${String(totalMembers + 1).padStart(3, "0")}`

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return constructResponse({
        statusCode: 400,
        message: "Invalid plan selected",
      })
    }

    const now = new Date()
    const endDate = new Date(now)
    if (plan.interval === PlanInterval.monthly) {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }
    const hashedPassword = await hashPassword(password)
    const newMember = await prisma.account.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        dob: new Date(dob),
        gender: gender.toUpperCase() as Gender,
        role: AccountRole.member,
        status: AccountStatus.active,
        memberId,
        password: hashedPassword,
        subscription: {
          create: {
            planId,
            startDate: now,
            endDate,
            amount: plan.price,
            status: AccountStatus.active,
          },
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    return constructResponse({
      statusCode: 201,
      message: "Member created successfully",
      data: newMember,
    })
  } catch (error) {
    return constructResponse({
      statusCode: 400,
      message: "Invalid request data",
    })
  }
}
