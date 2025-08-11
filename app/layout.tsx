import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import AppGuard from "@/components/admin/app-guard"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwayFitness - Transform Your Body, Elevate Your Lifestyle",
  description: "Join our premium fitness community and discover what your body is truly capable of",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppGuard>
          {children}
        </AppGuard>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
