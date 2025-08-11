"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PATHS } from "@/lib/constants/paths"
import { useAuthStore } from "@/lib/stores/authStore"
import { useSidebarStore } from "@/lib/stores/sidebarStore"
import { cn } from "@/lib/utils"
import { AccountRole } from "@prisma/client"
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Shield,
  User,
  Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: PATHS.AdminDashboard,
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    href: PATHS.AdminMembers,
    icon: Users,
  },
  {
    name: "Admins",
    href: PATHS.AdminAdmins,
    icon: Shield,
  },
  {
    name: "Plans",
    href: PATHS.AdminPlans,
    icon: Calendar,
  },
]

const superadminNavigation = [
  ...navigation,
  {
    name: "Subscriptions",
    href: PATHS.AdminSubscriptions,
    icon: CreditCard,
  },
  {
    name: "Transactions",
    href: PATHS.AdminTransactions,
    icon: Receipt,
  },

]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()
  const { collapsed, setCollapsed } = useSidebarStore()

  const navigationRoutes = user?.role === AccountRole.superadmin ? superadminNavigation : navigation

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Gym Admin</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="h-8 w-8">
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationRoutes.map((item) => {
            const isActive = pathname === item.href
            const NavItem = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavItem
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          {user && (
            <div className="flex items-center space-x-3">
              {!collapsed && (
                <Avatar className="h-8 w-8">
                  <AvatarImage />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role === AccountRole.superadmin ? "Super Admin" : "Admin"}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap space-x-1">
                {!collapsed && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href="/admin/profile">
                          <User className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profile</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
