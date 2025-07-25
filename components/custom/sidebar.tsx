"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/stores/authStore"
import { CreditCard, LogOut, Settings, User } from 'lucide-react'
import Link from "next/link"

export default function DashboardSidebar() {
    const { user, signOut } = useAuthStore()
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
                        <a
                            href="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg"
                        >
                            <User className="w-5 h-5" />
                            <span>Dashboard</span>
                        </a>
                        <a
                            href="/dashboard/profile"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <User className="w-5 h-5" />
                            <span>My Profile</span>
                        </a>
                        {/* <a
                            href="#"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Membership</span>
                        </a>
                        <a
                            href="#"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </a> */}
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
