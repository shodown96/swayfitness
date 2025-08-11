import AuthGuard from "@/components/admin/auth-guard"
import DashboardSidebar from "@/components/custom/sidebar"
import type React from "react"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
