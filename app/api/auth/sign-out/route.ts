import { checkAuth } from "@/actions/auth/check-auth";
import { ACCESS_TOKEN_NAME } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { DOMAIN } from "@/lib/constants/paths";
import { constructResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const { user } = await checkAuth(true)
    if (!user) throw new Error("User not found");

    cookieStore.delete({
      name: ACCESS_TOKEN_NAME,
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
      path: "/",
      domain: DOMAIN,
    })
    // cookieStore.delete({
    //     name: REFRESH_TOKEN_NAME,
    //     httpOnly: true,
    //     // maxAge: 24 * 60 * 60 * 1000,
    //     secure: process.env.NODE_ENV === "development" ? false : true,
    //     sameSite: process.env.NODE_ENV === "development" ? undefined : "strict",
    //     path: "/",
    //     domain: DOMAIN,
    // })

    return constructResponse({
      statusCode: 200,
    })
  } catch (error) {
    console.error("Error to sign in user", error);

    return constructResponse({
      statusCode: 401,
      message: ERROR_MESSAGES.InvalidCredentials,
    })
  }
}
