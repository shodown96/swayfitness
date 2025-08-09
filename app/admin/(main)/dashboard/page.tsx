"use client"

import { SendNotificationDialog } from "@/components/admin/send-notification-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dumps/admin-data"
import { AnalyticsService, DashboardMetrics } from "@/lib/services/analytics.service"
import { FullPlan } from "@/types/plan"
import { Bell, CreditCard, DollarSign, Download, UserPlus, Users } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";

const recentActivities = [
  { id: 1, action: 'New member registration', member: 'John Doe', time: '2 hours ago' },
  { id: 2, action: 'Payment received', member: 'Jane Smith', time: '4 hours ago' },
  { id: 3, action: 'Subscription renewed', member: 'Mike Johnson', time: '6 hours ago' },
  { id: 4, action: 'Plan upgraded', member: 'Sarah Wilson', time: '8 hours ago' },
  { id: 5, action: 'New member registration', member: 'David Brown', time: '1 day ago' },
]

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>()
  const [plans, setPlans] = useState<FullPlan[]>([])
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const exportPDF = useReactToPrint({
    contentRef: dashboardRef,
    documentTitle: "Dashboard Report",
  });

  const fetchMetrics = async () => {
    try {
      const { data } = await AnalyticsService.getDashboardMetrics()
      if (data) {
        setMetrics(data)
      }
    } catch (err) {
      console.error("Failed to fetch metrics", err)
    }
  }

  const fetchPlan = async () => {
    try {
      const { data } = await AnalyticsService.getPlanAnalytics()
      if (data) {
        setPlans(data.plans)
      }
    } catch (err) {
      console.error("Failed to fetch metrics", err)
    }
  }
  useEffect(() => {
    fetchMetrics()
    fetchPlan()
  }, [])

  return (
    <div className="space-y-6" ref={dashboardRef}>
      {/* Page Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your gym.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setOpenNotificationModal(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Send Announcement
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-gray-800">{metrics?.totalMembers || 0}</p>
                {/* <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12% from last month
                </p> */}
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-800">{metrics?.activeSubscriptions || 0}</p>
                {/* <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +8% from last month
                </p> */}
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(metrics?.monthlyRevenue || 0)}</p>
                {/* <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +15% from last month
                </p> */}
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Members</p>
                <p className="text-3xl font-bold text-gray-800">{metrics?.newMembersThisMonth || 0}</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        {metrics ? (
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{plan.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{plan._count.subscriptions} members</span>
                      <Badge variant="secondary">
                        {Math.round((plan._count.subscriptions / metrics.activeSubscriptions) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity (TODO)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.member}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <SendNotificationDialog
        open={openNotificationModal}
        setOpen={setOpenNotificationModal} />
    </div>
  )
}
