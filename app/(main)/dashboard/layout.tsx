import AuthGuard from "@/components/admin/auth-guard"
import DashboardSidebar from "@/components/custom/sidebar"
import type React from "react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar />
          {/* pt-14 offsets the fixed mobile top bar; md:pt-0 removes it on desktop */}
          <main className="flex-1 p-4 md:p-8 pt-18 md:pt-8 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
