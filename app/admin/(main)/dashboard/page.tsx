"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, DollarSign, UserPlus, TrendingUp, Download, Bell, Plus } from 'lucide-react'
import { dummyMembers, dummyTransactions, formatCurrency } from "@/lib/dumps/admin-data"

export default function AdminDashboardPage() {
  // Calculate metrics
  const totalMembers = dummyMembers.length
  const activeSubscriptions = dummyMembers.filter(m => m.status === 'active').length
  const monthlyRevenue = dummyTransactions
    .filter(t => t.status === 'success' && t.date.startsWith('2024-07'))
    .reduce((sum, t) => sum + t.amount, 0)
  const newMembersThisMonth = dummyMembers
    .filter(m => m.joinDate.startsWith('2024-07')).length

  const recentActivities = [
    { id: 1, action: 'New member registration', member: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Payment received', member: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Subscription renewed', member: 'Mike Johnson', time: '6 hours ago' },
    { id: 4, action: 'Plan upgraded', member: 'Sarah Wilson', time: '8 hours ago' },
    { id: 5, action: 'New member registration', member: 'David Brown', time: '1 day ago' },
  ]

  const planDistribution = [
    { name: 'Basic', count: dummyMembers.filter(m => m.plan.name.includes('Basic')).length, color: 'bg-blue-500' },
    { name: 'Premium', count: dummyMembers.filter(m => m.plan.name.includes('Premium')).length, color: 'bg-green-500' },
    { name: 'Elite', count: dummyMembers.filter(m => m.plan.name.includes('Elite')).length, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your gym.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
                <p className="text-3xl font-bold text-gray-800">{totalMembers}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12% from last month
                </p>
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
                <p className="text-3xl font-bold text-gray-800">{activeSubscriptions}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +8% from last month
                </p>
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
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(monthlyRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +15% from last month
                </p>
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
                <p className="text-3xl font-bold text-gray-800">{newMembersThisMonth}</p>
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
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${plan.color}`} />
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{plan.count} members</span>
                    <Badge variant="secondary">
                      {Math.round((plan.count / totalMembers) * 100)}%
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="w-6 h-6" />
              <span>Add New Member</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="w-6 h-6" />
              <span>Export Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Bell className="w-6 h-6" />
              <span>Send Announcement</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
