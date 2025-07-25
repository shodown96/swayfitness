import { Navigation } from "@/components/navigation"
import type React from "react"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="pt-16">{children}</main>
    </>
  )
}
