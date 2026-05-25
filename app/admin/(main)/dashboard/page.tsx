"use client"

import { SendNotificationDialog } from "@/components/admin/send-notification-modal"
import TextLoader from "@/components/custom/TextLoader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsService, DashboardMetrics } from "@/lib/services/analytics.service"
import { AuditLogEntry, AuditLogsService } from "@/lib/services/audit-logs.service"
import { formatCurrency } from "@/lib/utils"
import { FullPlan } from "@/types/plan"
import { Bell, CreditCard, DollarSign, Download, UserPlus, Users } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

// Map raw action strings to readable labels
const ACTION_LABELS: Record<string, string> = {
  refund_issued:           "Refund issued",
  subscription_cancelled:  "Subscription cancelled",
  member_updated:          "Member updated",
  member_deleted:          "Member deleted",
  plan_created:            "Plan created",
  plan_updated:            "Plan updated",
  plan_deleted:            "Plan deleted",
  admin_invited:           "Admin invited",
  notification_sent:       "Notification sent",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)   return "just now"
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  return `${days}d ago`
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    newMembersThisMonth: 0,
    memberGrowthRate: 0,
    revenueGrowthRate: 0,
    averageRevenuePerMember: 0,
    activeSubscriptions: 0,
  })
  const [plans, setPlans] = useState<FullPlan[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [openNotificationModal, setOpenNotificationModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const exportPDF = useReactToPrint({
    contentRef: dashboardRef,
    documentTitle: "Dashboard Report",
  })

  const fetchMetrics = async () => {
    try {
      const { data } = await AnalyticsService.getDashboardMetrics()
      if (data) setMetrics(data)
    } catch (err) {
      console.error("Failed to fetch metrics", err)
    }
  }

  const fetchPlan = async () => {
    try {
      const { data } = await AnalyticsService.getPlanAnalytics()
      if (data) setPlans(data.plans)
    } catch (err) {
      console.error("Failed to fetch plan analytics", err)
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const { data } = await AuditLogsService.getRecent(8)
      if (data) setAuditLogs(data.items)
    } catch (err) {
      console.error("Failed to fetch audit logs", err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchMetrics(), fetchPlan(), fetchAuditLogs()])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <TextLoader loading={loading}>
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
            <Button
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
                        {Math.round((plan._count.subscriptions / metrics.activeSubscriptions) * 100)||0}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No admin actions recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {ACTION_LABELS[log.action] ?? log.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{log.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">by {log.admin.name}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <SendNotificationDialog
          open={openNotificationModal}
          setOpen={setOpenNotificationModal} />
      </div>
    </TextLoader>
  )
}
