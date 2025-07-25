import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "monthly"

  // Simulated revenue analytics data
  const monthlyData = [
    { month: "Jan 2024", revenue: 1250000, members: 45 },
    { month: "Feb 2024", revenue: 1380000, members: 52 },
    { month: "Mar 2024", revenue: 1420000, members: 58 },
    { month: "Apr 2024", revenue: 1650000, members: 67 },
    { month: "May 2024", revenue: 1780000, members: 73 },
    { month: "Jun 2024", revenue: 1920000, members: 81 },
    { month: "Jul 2024", revenue: 2100000, members: 89 },
  ]

  const yearlyData = [
    { year: "2022", revenue: 15600000, members: 234 },
    { year: "2023", revenue: 18900000, members: 312 },
    { year: "2024", revenue: 12370000, members: 89 },
  ]

  const byPlanData = [
    { planName: "Basic Monthly", revenue: 4500000, percentage: 35 },
    { planName: "Premium Monthly", revenue: 5250000, percentage: 42 },
    { planName: "Elite Monthly", revenue: 2870000, percentage: 23 },
  ]

  return NextResponse.json({
    success: true,
    data: {
      monthly: monthlyData,
      yearly: yearlyData,
      byPlan: byPlanData,
    },
  })
}
