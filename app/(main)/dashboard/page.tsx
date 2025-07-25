"use client"

import DashboardSidebar from "@/components/custom/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { PATHS } from "@/lib/constants/paths"
import { formatPrice } from "@/lib/plans"
import { useAuthStore } from "@/lib/stores/authStore"
import { daysUntilNextBilling } from "@/lib/utils"
import { GetManageSubscriptionLinkResponse } from "@/types/responses"
import { CheckCircle, Download, ExternalLink, QrCode } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [manageLink, setManageLink] = useState("")


  const getDaysSinceJoining = (joinDate: string | Date): number => {
    const join = new Date(joinDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - join.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `${user?.id}-qr-code.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  const getLink = async () => {
    const result = await mainClient.get<GetManageSubscriptionLinkResponse>(API_ENDPOINTS.Transactions.GetManageSubscriptionLink)
    if (result.success && result.data) {
      setManageLink(result.data.link)
    }
  }
  useEffect(() => {
    if (!manageLink) {
      getLink()
    }
  }, [manageLink])

  if (!user) return null

  const qrCodeUrl = `${window.location.origin}${PATHS.MemberInfo}?id=${user.id}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">Here's your fitness journey overview</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {getDaysSinceJoining(user.createdAt)}
                </div>
                <p className="text-gray-600">Days since joining</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {user.subscription?.nextBillingDate ? daysUntilNextBilling(user.subscription?.nextBillingDate) : 'N/A'}
                </div>
                <p className="text-gray-600">Current plan duration (days)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {formatPrice(Number(user.subscription?.amount))}
                </div>
                <p className="text-gray-600">Next payment amount</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Membership Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Membership Status
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {user.subscription ? user.subscription?.status.charAt(0).toUpperCase() + user.subscription?.status.slice(1) : 'N/A'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{user.subscription?.plan.name}</h3>
                  <p className="text-gray-600">
                    {formatPrice(Number(user.subscription?.amount || 0))}/{user.subscription?.plan.interval}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="font-medium">{user.subscription?.nextBillingDate ? new Date(user.subscription.nextBillingDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">{user.subscription?.startDate ? new Date(user.subscription?.startDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Plan Benefits:</h4>
                  <ul className="space-y-1">
                    {user.subscription?.plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  disabled={!manageLink}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    window.open(manageLink || 'https://paystack.com/customer-portal', '_blank')
                    getLink()
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>

            {/* Digital Membership Card */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Membership Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <p className="text-orange-100">{user.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-orange-100">SwayFitness</p>
                      <p className="text-xs text-orange-200">Member</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-orange-100">{user.subscription?.plan.name}</p>
                      <p className="text-xs text-orange-200">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <QRCode
                        id="qr-code"
                        value={qrCodeUrl}
                        size={60}
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Show QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Digital Membership QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <QRCode
                          value={qrCodeUrl}
                          size={200}
                          level="M"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        Present this code at the gym for entry
                      </p>
                      <Button onClick={downloadQRCode} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Profile Overview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage  />
                  <AvatarFallback className="bg-orange-500 text-white text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.phone}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
