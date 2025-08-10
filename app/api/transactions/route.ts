import { checkAuth } from "@/actions/auth/check-auth";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { prisma } from "@/lib/prisma";
import { constructResponse, paginateItems } from "@/lib/response";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { user } = await checkAuth(true)
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const type = searchParams.get("type") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: any = {
    ...(status !== "all" && { status }),
    ...(type !== "all" && { type }),
    ...(search && {
      OR: [
        { account: { name: { contains: search, mode: "insensitive" } } },
        { description: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include: {
        account: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return constructResponse({
    statusCode: 200,
    data: paginateItems({
      page,
      pageSize: limit,
      items: transactions,
      total,
    }),
  });
}
