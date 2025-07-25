"use client"

import type React from "react"

import AdminGuard from "@/components/admin/admin-guard"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useStoreHydration } from "@/hooks/store-hydration"
import { useAuthStore } from "@/lib/stores/authStore"
import { useSidebarStore } from "@/lib/stores/sidebarStore"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrate = useAuthStore.persist?.rehydrate;
  const alreadyHydrated = useAuthStore.persist?.hasHydrated();
  const { hasHydrated } = useStoreHydration({ hydrate, alreadyHydrated });
  const { collapsed } = useSidebarStore()

  if (!hasHydrated) return null

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "ml-16" : "ml-64"
        )}>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AdminGuard>
  )
}
