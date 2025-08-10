"use client"

import EditAdminModal from "@/components/admin/edit-admin-modal"
import InviteAdminModal from "@/components/admin/invite-admin-modal"
import TableSkeleton from "@/components/custom/TableSkeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useAPIQuery from "@/hooks/use-api-query"
import { AdminsService } from "@/lib/services/admins.service"
import { useAdminStore } from "@/lib/stores/adminStore"
import { useAuthStore } from "@/lib/stores/authStore"
import { delayDebounceFn } from "@/lib/utils"
import { FullAccount } from "@/types/account"
import { AccountRole } from "@prisma/client"
import { ChevronLeft, ChevronRight, Edit, Shield, UserPlus } from 'lucide-react'
import { useEffect, useState } from "react"

export default function AdminsPage() {
  const [admins, setAdmins] = useState<FullAccount[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { setQuery, query, pagination, setPagination } = useAPIQuery()
  const [stats, setStats] = useState({
    totalAdmins: 0,
    superAdmins: 0,
    activeAdmins: 0,
  })
  const { openInviteModalOpen, openEditAdminModalOpen } = useAdminStore()

  const onActionComplete = async () => {
    const { data } = await AdminsService.getAll()
    if (data) {
      setAdmins(data.items)
    }
  }

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


  const fetchData = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await AdminsService.getAll(query)
      if (data) {
        setAdmins(data.items)
        setPagination(data)
      }
    } catch (err) {
      console.error("Failed to fetch admins", err)
    } finally {
      setFetching(false)
    }
  }
  const fetchStats = async () => {
    try {
      const { data } = await AdminsService.stats()
      if (data) {
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats", err)
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
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openInviteModalOpen}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Admin
        </Button>
        <Button onClick={handleRefresh} variant={'secondary'} disabled={refreshing}>
          Refresh admins
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalAdmins}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.superAdmins}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.activeAdmins}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administrator</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton
                loading={fetching || refreshing}
                rows={admins.length || 1}
                columns={6}>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={admin.role === AccountRole.superadmin ? '!bg-purple-100 !text-purple-800' : '!bg-blue-100 !text-blue-800'}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {admin.phone || "-"}
                      </TableCell>
                      <TableCell>
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge className={admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditAdminModalOpen(admin)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
              </TableSkeleton>
            </TableBody>
          </Table>{/* Pagination */}
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

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Super Admin</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Full system access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Manage all administrators</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>System configuration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Financial reports access</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">Admin</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Manage members</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>View subscriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Process transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>No admin management</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <InviteAdminModal onActionComplete={onActionComplete} />
      <EditAdminModal onActionComplete={onActionComplete} />
    </div>
  )
}
