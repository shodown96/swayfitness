"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from "react"

interface AdminUser {
  name: string
  role: string
}

export function AdminHeader() {
  const pathname = usePathname()
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    const storedAdmin = localStorage.getItem('gym_admin')
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin))
    }
  }, [])

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    return segments.map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    ).join(' / ')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div>
          <nav className="text-sm text-gray-500">
            {getBreadcrumb()}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Admin Profile */}
          {adminUser && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage  />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {adminUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
