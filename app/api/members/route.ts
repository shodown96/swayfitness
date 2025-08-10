import { checkAuth } from "@/actions/auth/check-auth"
import { generateRandomPassword } from "@/lib/auth"
import { hashPassword } from "@/lib/bcrypt"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { prisma } from "@/lib/prisma"
import { constructResponse, paginateItems } from "@/lib/response"
import { AccountRole, AccountStatus, Gender } from "@prisma/client"
import { NextRequest } from "next/server"

// GET /api/members
export async function GET(request: NextRequest) {
  try {
    await checkAuth(true)
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
      ...(status !== "all" && { status: status as AccountStatus }),
      ...(planId && planId !== "all" && {
        subscription: { planId },
      }),
    }

    const [members, total] = await Promise.all([
      prisma.account.findMany({
        where,
        include: {
          subscription: { include: { plan: true } },
        },
        omit: { password: true },
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
    console.log(error)
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}

// POST /api/members
export async function POST(request: NextRequest) {
  try {
    await checkAuth(true)
    const body = await request.json()
    const { name, email, phone, dob, gender, planId } = body

    if (!name || !email || !phone || !dob || !gender || !planId) {
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

    const password = generateRandomPassword()
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
      },
      omit: { password: true }
    })

    return constructResponse({
      statusCode: 201,
      message: "Member created successfully",
      data: newMember,
    })
  } catch (error) {
    console.log(error)
    return constructResponse({
      statusCode: 500,
      message: "Invalid request data",
    })
  }
}
