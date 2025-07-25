"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { FullAccount } from "@/types/account"
import { GetMemberResponse } from "@/types/responses"
import { Calendar, CheckCircle, Mail, User, XCircle } from 'lucide-react'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// TODO: Move to Admins only
export default function MemberInfoPage() {
  const searchParams = useSearchParams()
  const [memberData, setMemberData] = useState<FullAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getMember = async () => {
      const memberId = searchParams.get('id')
      if (!memberId) {
        setError("Invalid member ID")
        setIsLoading(false)
        return
      }
      const result = await mainClient.get<GetMemberResponse>(API_ENDPOINTS.Members.ById(memberId))
      if (result.success && result.data) {
        setMemberData(result.data.member)
        setIsLoading(false)
      }
    }
    getMember()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member information...</p>
        </div>
      </div>
    )
  }

  if (error || !memberData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Member Not Found</h2>
            <p className="text-gray-600">{error || "The requested member information could not be found."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isActive = memberData.subscription?.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">SwayFitness</h1>
          <h2 className="text-xl text-gray-600">Member Verification</h2>
        </div>

        {/* Member Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage />
                <AvatarFallback className="bg-orange-500 text-white text-2xl">
                  {memberData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-slate-800">{memberData.name}</CardTitle>
            <div className="flex items-center justify-center space-x-2 mt-2">
              {isActive ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isActive ? "Active Membership" : "Expired Membership"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member ID</p>
                  <p className="font-semibold">{memberData.memberId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p className="font-semibold">{new Date(memberData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-semibold">{memberData.subscription?.plan.name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className={`w-5 h-5 mr-2 ${isActive ? 'text-green-500' : 'text-red-500'}`} />
              Plan Access Includes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {memberData.subscription?.plan.features.map((access, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className={`w-4 h-4 mr-3 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={isActive ? 'text-gray-700' : 'text-gray-400'}>{access}</span>
                </li>
              ))}
            </ul>

            {!isActive && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠️ Membership Expired - Access Restricted
                </p>
                <p className="text-red-600 text-sm mt-1">
                  Please contact reception to renew your membership.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staff Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For staff use only - Verify member status before granting facility access</p>
        </div>
      </div>
    </div>
  )
}
