import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Simulated member analytics data
  const demographics = {
    ageGroups: [
      { range: "18-25", count: 23 },
      { range: "26-35", count: 45 },
      { range: "36-45", count: 32 },
      { range: "46-55", count: 18 },
      { range: "55+", count: 12 },
    ],
    gender: [
      { gender: "Male", count: 78 },
      { gender: "Female", count: 52 },
    ],
  }

  const retention = {
    monthly: [
      { month: "Jan", retentionRate: 85 },
      { month: "Feb", retentionRate: 87 },
      { month: "Mar", retentionRate: 82 },
      { month: "Apr", retentionRate: 89 },
      { month: "May", retentionRate: 91 },
      { month: "Jun", retentionRate: 88 },
      { month: "Jul", retentionRate: 93 },
    ],
    byPlan: [
      { planName: "Basic Monthly", retentionRate: 78 },
      { planName: "Premium Monthly", retentionRate: 85 },
      { planName: "Elite Monthly", retentionRate: 92 },
    ],
  }

  const growth = [
    { month: "Jan", newMembers: 12, churnedMembers: 3 },
    { month: "Feb", newMembers: 15, churnedMembers: 2 },
    { month: "Mar", newMembers: 18, churnedMembers: 4 },
    { month: "Apr", newMembers: 22, churnedMembers: 3 },
    { month: "May", newMembers: 19, churnedMembers: 2 },
    { month: "Jun", newMembers: 25, churnedMembers: 5 },
    { month: "Jul", newMembers: 28, churnedMembers: 3 },
  ]

  return NextResponse.json({
    success: true,
    data: {
      demographics,
      retention,
      growth,
    },
  })
}
