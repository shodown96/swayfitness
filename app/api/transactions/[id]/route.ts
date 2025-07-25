import { prisma } from "@/lib/prisma"
import { constructResponse } from "@/lib/response"
import { APIRouteIDParams } from "@/types/common"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: APIRouteIDParams
) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const transaction = await prisma.transaction.findUnique({
    where: { id: (await params).id },
  })

  if (!transaction) {
    return constructResponse({
      statusCode: 404,
      message: "Transaction not found",
    })
  }

  return constructResponse({
    statusCode: 200,
    data: transaction,
  })
}
