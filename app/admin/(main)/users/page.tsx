"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, getStatusColor, } from "@/lib/dumps/admin-data"
import { MembersService } from "@/lib/services/members.service"
import { FullAccount } from "@/types/account"
import { ChevronLeft, ChevronRight, Download, Edit, Eye, Search, UserX } from 'lucide-react'
import { useEffect, useState } from "react"

export default function UsersPage() {
  const [members, setMembers] = useState<FullAccount[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<FullAccount | null>(null)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await MembersService.getAll()
        if (data) {
          setMembers(data.items)
        }
      } catch (err) {
        console.error("Failed to fetch members", err)
      }
    }

    fetchData()
  }, [])

  const filteredUsers = members.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.memberId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesPlan = planFilter === "all" || user.subscription?.plan?.name.toLowerCase().includes(planFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesPlan
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleExport = () => {
    alert("Export functionality would be implemented here")
  }

  const handleUserAction = async (action: string, user: FullAccount) => {
    switch (action) {
      case 'view':
        setSelectedUser(user)
        break
      case 'edit':
        alert(`Edit user: ${user.name}`)
        break
      case 'suspend':
        try {
          await MembersService.updateStatus(user.id, "suspended")
          const { data } = await MembersService.getAll()
          if (data) {
            setMembers(data.items)
          }
        } catch (err) {
          console.error("Suspend failed", err)
        }
        break
      case 'delete':
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          try {
            await MembersService.delete(user.id)
            const { data } = await MembersService.getAll()
            if (data) {
              setMembers(data.items)
            }
          } catch (err) {
            console.error("Delete failed", err)
          }
        }
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-1">Manage gym members and their subscriptions</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredUsers.length})</CardTitle>
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
                <TableHead>Total Paid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage  />
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
                    {/* {formatCurrency(user.totalPaid)} */}
                    Total paid
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction('view', user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction('edit', user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction('suspend', user)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage  />
                  <AvatarFallback className="text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Member ID:</span> {selectedUser.memberId}</div>
                    <div><span className="text-gray-600">Phone:</span> {selectedUser.phone}</div>
                    <div><span className="text-gray-600">Date of Birth:</span> {selectedUser.dob? new Date(selectedUser.dob).toLocaleDateString():'N/A'}</div>
                    <div><span className="text-gray-600">Gender:</span> {selectedUser.gender}</div>
                    <div><span className="text-gray-600">Join Date:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Subscription Details</h4>
                  {selectedUser.subscription ? (
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Plan:</span> {selectedUser.subscription.plan.name}</div>
                      <div><span className="text-gray-600">Price:</span> {formatCurrency(Number(selectedUser.subscription.plan.price))}/{selectedUser.subscription.plan.interval}</div>
                      <div><span className="text-gray-600">Next Billing:</span> {selectedUser.subscription.nextBillingDate? (new Date(selectedUser.subscription.nextBillingDate).toLocaleDateString()):'N/A'}</div>
                      {/* <div><span className="text-gray-600">Total Paid:</span> {formatCurrency(selectedUser.totalPaid)}</div> */}
                      <div>Total paid</div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleUserAction('edit', selectedUser)}>
                  Edit Member
                </Button>
                <Button variant="outline" onClick={() => handleUserAction('suspend', selectedUser)}>
                  Suspend Member
                </Button>
                <Button variant="destructive" onClick={() => handleUserAction('delete', selectedUser)}>
                  Delete Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
