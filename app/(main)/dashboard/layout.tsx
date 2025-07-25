import AuthGuard from "@/components/admin/auth-guard"
import type React from "react"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}
