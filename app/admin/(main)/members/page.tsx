"use client"

import EditUserModal from "@/components/admin/edit-user-modal"
import UserDetailModal from "@/components/admin/user-detail-modal"
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
import { API_ENDPOINTS } from "@/lib/constants/api"
import { MembersService } from "@/lib/services/members.service"
import { PlansService } from "@/lib/services/plans.service"
import { useAdminStore } from "@/lib/stores/adminStore"
import { delayDebounceFn, getStatusColor } from "@/lib/utils"
import { FullAccount } from "@/types/account"
import { FullPlan } from "@/types/plan"
import { ChevronLeft, ChevronRight, Download, Edit, Eye, Search } from 'lucide-react'
import { useEffect, useState } from "react"
import { toast } from "sonner"


export default function MembersPage() {
  const [members, setMembers] = useState<FullAccount[]>([])
  const [plans, setPlans] = useState<FullPlan[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [exporting, setExporting] = useState(false)
  const { setQuery, query, pagination, setPagination } = useAPIQuery()
  const {
    selectedAccount,
    setSelectedAccount,
    openEditUserModal,
    openViewUserModal
  } = useAdminStore()

  const handleRefresh = async () => {
    setRefreshing(true)
    setQuery({
      page: 1,
      search: "",
      status: undefined,
      plan: undefined
    });
    await fetchData()
    setRefreshing(false)
  };

  const fetchPlans = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await PlansService.getAllForAdmin()
      if (data) {
        setPlans(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch plans", err)
    } finally {
      setFetching(false)
    }
  }

  const fetchData = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await MembersService.getAll(query)
      if (data) {
        setMembers(data.items)
        setPagination(data)
      }
    } catch (err) {
      console.error("Failed to fetch members", err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (refreshing) return;
    if (query.search?.length) {
      const delayDebounce = delayDebounceFn(fetchData);
      return () => clearTimeout(delayDebounce);
    } else {
      fetchData()
    }
  }, [query])

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleExport = async () => {
    try {
      setExporting(true)
      const response = await fetch(API_ENDPOINTS.Members.Export, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Export failed')
        setExporting(false)
      }

      // Get the CSV content
      const csvContent = await response.text()

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setExporting(false)
    } catch (error) {
      toast.error('Export failed')
      setExporting(false)

    }
  }

  const onActionComplete = async (user: FullAccount) => {
    const { data } = await MembersService.getAll(query)
    if (data) {
      setMembers(data.items)
      setPagination(data)
      setSelectedAccount(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Members</h1>
          <p className="text-gray-600 mt-1">Manage gym members</p>
        </div>
        <div className="flex items-center gap-2">

          <Button
            onClick={handleExport}
            variant="outline"
            disabled={exporting}>
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting' : 'Export CSV'}
          </Button>
          {/* 
          <Button onClick={handleExport}>
            <UserPlus className="w-4 h-4 mr-2" />
            Create user
          </Button> */}
          <Button onClick={handleRefresh} variant={'secondary'} disabled={refreshing}>
            Refresh users
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or member ID..."
                  value={query.search}
                  onChange={(e) => setQuery({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={query.status}
              onChange={value => setQuery({ status: value })}
              placeholder="Status"
              containerClass="w-40"
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "suspended", label: "Suspended" },
              ]}
            />
            <Select
              value={query.plan}
              onChange={value => setQuery({ plan: value })}
              placeholder="All Plans"
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              <TableSkeleton
                loading={fetching || refreshing}
                rows={members.length || 1}
                columns={6}>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{user.memberId}</TableCell>
                      <TableCell>{user.subscription?.plan?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewUserModal(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditUserModal(user)}
                          >
                            <Edit className="w-4 h-4" />
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
      {selectedAccount ? (
        <>
          <UserDetailModal
            onActionComplete={onActionComplete} />

          <EditUserModal
            onActionComplete={onActionComplete} />
        </>
      ) : null}

    </div>
  )
}
