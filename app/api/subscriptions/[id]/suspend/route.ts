import { checkAuth } from "@/actions/auth/check-auth"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  const { user } = await checkAuth(true)
  return NextResponse.json({
    success: true,
    message: "Subscription suspended successfully",
  })
}
