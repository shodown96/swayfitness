"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PATHS } from "@/lib/constants/paths"
import { useAuthStore } from "@/lib/stores/authStore"
import { cn } from "@/lib/utils"
import { CreditCard, LogOut, User } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardSidebar() {
    const pathname = usePathname()
    const { user, signOut } = useAuthStore()

    const routes = [
        { name: 'Dashboard', icon: User, path: PATHS.Dashboard },
        { name: 'Profile', icon: User, path: PATHS.DashboardProfile },
        { name: 'Plans & Billing', icon: CreditCard, path: PATHS.DashboardBilling },
        // { name: 'Settings', icon: Settings, path: PATHS.DashboardProfile },
    ]
    if (!user) return null;
    return (
        <>
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm border-r min-h-screen">
                <div className="p-6">
                    <Link href={"/"} className="cursor-pointer">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">SwayFitness</h2>
                    </Link>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-12 w-12">
                            <AvatarImage />
                            <AvatarFallback className="bg-orange-500 text-white">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.memberId}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {routes.map(route => (
                            <a
                                key={route.path}
                                href={route.path}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg",
                                    pathname === route.path ? 'bg-orange-50 text-orange-600' : ''
                                )}
                            >
                                <route.icon className="w-5 h-5" />
                                <span>{route.name}</span>
                            </a>
                        ))}
                        <button
                            onClick={signOut}
                            className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </div>
        </>
    )
}
