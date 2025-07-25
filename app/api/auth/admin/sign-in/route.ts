import { ACCESS_TOKEN_NAME, generateAccessToken } from "@/lib/auth";
import { isPasswordCorrect } from "@/lib/bcrypt";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { DOMAIN } from "@/lib/constants/paths";
import { prisma } from "@/lib/prisma";
import { constructResponse } from "@/lib/response";
import { syncLastLogin } from "@/lib/sync-last-login";
import { AccountRole } from "@prisma/client";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  try {
    const { email, password } = await request.json()


    const user = await prisma.account.findUnique({
      where: { email, role: { not: AccountRole.member } }
    })

    if (!user) {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.InvalidCredentials,
      })
    }
    const isPass = await isPasswordCorrect(password, user.password)
    if (!isPass) {
      return constructResponse({
        statusCode: 401,
        message: ERROR_MESSAGES.InvalidCredentials,
      })
    }

    const accessToken = await generateAccessToken(user);
    // const refreshToken = await generateRefreshToken(user);

    const cookieStore = await cookies()
    cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 DAY
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
      path: "/",
      domain: DOMAIN
    })
    // cookieStore.set(REFRESH_TOKEN_NAME, refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000, // 1 DAY
    //     secure: process.env.NODE_ENV === "development" ? false : true,
    //     sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
    //     path: "/",
    //     domain: DOMAIN
    // })
    await syncLastLogin({ accountId: user.id, lastLogin: user.lastLogin })

    return constructResponse({
      statusCode: 200,
      data: {
        user,
        accessToken,
      },
    })

  } catch (error) {
    return constructResponse({
      statusCode: 500,
      message: ERROR_MESSAGES.InternalServerError,
    })
  }
}
