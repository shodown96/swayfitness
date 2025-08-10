"use client"

import EditSubscriptionModal from "@/components/admin/edit-subscription-modal"
import { Select } from "@/components/custom/Select"
import TableSkeleton from "@/components/custom/TableSkeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useAPIQuery from "@/hooks/use-api-query"
import { PlansService } from "@/lib/services/plans.service"
import { SubscriptionsService } from "@/lib/services/subscriptions.service"
import { useAdminSubscriptionStore } from "@/lib/stores/adminSubStore"
import { delayDebounceFn, formatCurrency } from "@/lib/utils"
import { FullPlan, FullSubscription } from "@/types/plan"
import { AlertCircle, ChevronLeft, ChevronRight, CreditCard, Edit, Pause, Search, Users, X } from 'lucide-react'
import { useEffect, useState } from "react"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<FullSubscription[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [plans, setPlans] = useState<FullPlan[]>([])
  const { setQuery, query, pagination, setPagination } = useAPIQuery()
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    suspendedSubscriptions: 0,
    totalRevenue: 0
  })
  const { openModal } = useAdminSubscriptionStore()

  const onActionComplete = async () => {
    const { data } = await SubscriptionsService.getAll()
    if (data) {
      setSubscriptions(data.items)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setQuery({
      page: 1,
      search: "",
      status: undefined,
      plan: undefined
    })
    await fetchData()
    setRefreshing(false)
  }

  const fetchData = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await SubscriptionsService.getAll(query)
      if (data) {
        setSubscriptions(data.items)
        setPagination(data)
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions", err)
    } finally {
      setFetching(false)
    }
  }

  const fetchPlans = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await PlansService.getAllForAdmin(query)
      if (data) {
        setPlans(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch plans", err)
    } finally {
      setFetching(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await SubscriptionsService.getStats()
      if (data) {
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats", err)
    }
  }

  const handleSearchChange = (value: string) => {
    setQuery({ search: value, page: 1 })
  }

  const handleStatusFilter = (value: string) => {
    setQuery({ status: value === "all" ? undefined : value, page: 1 })
  }

  const handlePlanFilter = (value: string) => {
    setQuery({ plan: value === "all" ? undefined : value, page: 1 })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (refreshing) return
    if (query.search?.length) {
      const delayDebounce = delayDebounceFn(fetchData)
      return () => clearTimeout(delayDebounce)
    } else {
      fetchData()
    }
  }, [query])

  useEffect(() => {
    fetchStats()
    fetchPlans()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage member subscriptions and billing</p>
        </div>
        <Button onClick={handleRefresh} variant={'secondary'} disabled={refreshing}>
          Refresh subscriptions
        </Button>
      </div>

      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeSubscriptions}</p>
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
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-red-600">{stats.expiredSubscriptions}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.suspendedSubscriptions}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Pause className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by member name or plan name..."
                  value={query.search || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={query.status}
              onChange={handleStatusFilter}
              placeholder="Status"
              containerClass="w-40"
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "suspended", label: "Suspended" },
              ]}
            />
            <Select
              value={query.plan}
              onChange={handlePlanFilter}
              placeholder="Plan"
              containerClass="w-40"
              options={[
                { value: "all", label: "All Plans" },
                ...(plans.length ? plans.map(v => (
                  { value: v.id, label: v.name }
                )) : [])
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton
                loading={fetching || refreshing}
                rows={subscriptions.length || 1}
                columns={7}>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {subscription.account.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{subscription.account.name}</p>
                            <p className="text-sm text-gray-500">{subscription.account.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{subscription.plan.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{formatCurrency(subscription.plan.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('modify', subscription)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('suspend', subscription)}
                            disabled={subscription.status === 'suspended'}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('cancel', subscription)}
                            disabled={subscription.status === 'expired'}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
              </TableSkeleton>
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-end mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery({ page: Math.max(pagination.currentPage - 1, 1) })}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery({ page: Math.min(pagination.currentPage + 1, pagination.totalPages) })}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSubscriptionModal onActionComplete={onActionComplete} />
    </div>
  )
}