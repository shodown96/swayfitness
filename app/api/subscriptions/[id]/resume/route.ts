import { checkAuth } from "@/actions/auth/check-auth"
import { constructResponse } from "@/lib/response"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  const { user } = await checkAuth(true)
  if (user?.role !== 'superadmin') {
    return constructResponse({
      statusCode: 401,
      message: "Only super admins have access to this resource",
    })
  }
  return NextResponse.json({
    success: true,
    message: "Subscription resumed successfully",
  })
}
