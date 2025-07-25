import { APIRouteIDParams } from "@/types/common"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "Subscription suspended successfully",
  })
}
