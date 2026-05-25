"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PATHS } from "@/lib/constants/paths"
import { useAuthStore } from "@/lib/stores/authStore"
import { FullAccount } from "@/types/account"
import { cn } from "@/lib/utils"
import { CreditCard, LayoutDashboard, LogOut, Menu, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const routes = [
  { name: "Dashboard", icon: LayoutDashboard, path: PATHS.Dashboard },
  { name: "Profile", icon: User, path: PATHS.DashboardProfile },
  { name: "Plans & Billing", icon: CreditCard, path: PATHS.DashboardBilling },
]

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { signOut } = useAuthStore()
  return (
    <nav className="space-y-1">
      {routes.map((route) => (
        <a
          key={route.path}
          href={route.path}
          onClick={onNavigate}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname === route.path
              ? "bg-orange-50 text-orange-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <route.icon className="w-5 h-5 shrink-0" />
          <span>{route.name}</span>
        </a>
      ))}
      <button
        onClick={() => { onNavigate?.(); signOut() }}
        className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left text-sm transition-colors"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span>Logout</span>
      </button>
    </nav>
  )
}

function UserCard({ user }: { user: FullAccount }) {
  return (
    <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
        <AvatarFallback className="bg-orange-500 text-white text-sm font-semibold">
          {user.name.split(" ").map((n: string) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.memberId}</p>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-white border-b shadow-sm">
        <Link href="/" className="text-lg font-bold text-slate-800">
          SwayFitness
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-6 h-full flex flex-col">
              <Link href="/" className="text-xl font-bold text-slate-800 mb-6 block">
                SwayFitness
              </Link>
              <UserCard user={user} />
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white shadow-sm border-r min-h-screen flex-col">
        <div className="p-6 flex flex-col h-full">
          <Link href="/" className="cursor-pointer mb-6 block">
            <h2 className="text-xl font-bold text-slate-800">SwayFitness</h2>
          </Link>
          <UserCard user={user} />
          <NavLinks pathname={pathname} />
        </div>
      </aside>
    </>
  )
}
