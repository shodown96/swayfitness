"use client"

import CreatePlanModal from "@/components/admin/create-plan-modal"
import EditPlanModal from "@/components/admin/edit-plan-form"
import DeletePlanModal from "@/components/admin/delete-plan-modal"
import TableSkeleton from "@/components/custom/TableSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAPIQuery from "@/hooks/use-api-query"
import { PlansService } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import { delayDebounceFn, formatCurrency } from "@/lib/utils"
import { FullPlan } from "@/types/plan"
import { PlanStatus } from "@prisma/client"
import { Copy, Edit, MoreHorizontal, Plus, Power, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Select } from "@/components/custom/Select"

export default function NewPlansPage() {
  const [plans, setPlans] = useState<FullPlan[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { setQuery, query, pagination, setPagination } = useAPIQuery()
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalMembers: 0,
    averagePrice: 0,
  })
  const {
    openCreateModalOpen,
    openEditModalOpen,
    openDeleteModalOpen
  } = usePlanStore()

  const onActionComplete = async () => {
    const { data } = await PlansService.getAllForAdmin(query)
    if (data) {
      setPlans(data.items)
    }
    await fetchStats()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setQuery({
      page: 1,
      search: "",
      status: undefined,
      interval: undefined
    })
    await fetchData()
    setRefreshing(false)
  }

  const fetchData = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await PlansService.getAllForAdmin(query)
      if (data) {
        setPlans(data.items)
        setPagination(data)
      }
    } catch (err) {
      console.error("Failed to fetch plans", err)
    } finally {
      setFetching(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await PlansService.getStats()
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

  const handleIntervalFilter = (value: string) => {
    setQuery({ interval: value === "all" ? undefined : value, page: 1 })
  }

  const handleToggleStatus = async (plan: FullPlan) => {
    try {
      const toggleData = plan.status === 'active' ?
        { status: 'inactive' } : { status: 'active' }
      const { success } = await PlansService.update(plan.id, toggleData)
      if (success) {
        await fetchData()
        await fetchStats()
      }
    } catch (err) {
      console.error("Failed to toggle plan status", err)
    }
  }

  const openEditModal = (plan: FullPlan) => {
    openEditModalOpen(plan)
  }

  const openDeleteModal = (plan: FullPlan) => {
    openDeleteModalOpen(plan)
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
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-600 mt-1">Manage your gym membership plans and pricing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={openCreateModalOpen}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
          <Button onClick={handleRefresh} variant={'secondary'} disabled={refreshing}>
            Refresh plans
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalPlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averagePrice)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                value={query.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={query.status}
              onChange={handleStatusFilter}
              placeholder="Filter by status"
              containerClass="w-full sm:w-[180px]"
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <Select
              value={query.interval}
              onChange={handleIntervalFilter}
              placeholder="Filter by status"
              containerClass="w-full sm:w-[180px]"
              options={[
                { value: "all", label: "All Intervals" },
                { value: "monthly", label: "Monthly" },
                { value: "anaually", label: "Annually" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans ({pagination.total || 0})</CardTitle>
          <CardDescription>A list of all membership plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableSkeleton
                  loading={fetching || refreshing}
                  rows={plans.length || 1}
                  columns={7}>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No plans found
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(Number(plan.amount))}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.interval}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.status === PlanStatus.active ? "default" : "secondary"}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{plan._count?.subscriptions || 0}</TableCell>
                        <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(plan)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(plan)}>
                                <Power className="mr-2 h-4 w-4" />
                                {plan.status === PlanStatus.active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(plan)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableSkeleton>
              </TableBody>
            </Table>
          </div>

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

      {/* Plan Features Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">Monthly Plans</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Lower commitment for new members</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Higher monthly revenue per member</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Easier to modify pricing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>Higher churn rate potential</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Annual Plans</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Better cash flow with upfront payment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Lower member churn rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Attractive discount for members</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>Higher barrier to entry</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreatePlanModal onActionComplete={onActionComplete} />
      <EditPlanModal onActionComplete={onActionComplete} />
      <DeletePlanModal onActionComplete={onActionComplete} />
    </div>
  )
}