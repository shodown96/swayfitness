"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter, Eye, Edit, Pause, X, ChevronLeft, ChevronRight, CreditCard, Users, AlertCircle } from 'lucide-react'
import { dummyMembers, formatCurrency, getStatusColor, type Member } from "@/lib/dumps/admin-data"

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubscription, setSelectedSubscription] = useState<Member | null>(null)
  const [actionType, setActionType] = useState<'modify' | 'cancel' | 'suspend' | null>(null)
  const itemsPerPage = 20

  // Filter subscriptions
  const filteredSubscriptions = dummyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.plan.status === statusFilter
    const matchesPlan = planFilter === "all" || member.plan.name.toLowerCase().includes(planFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesPlan
  })

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage)

  // Calculate stats
  const activeSubscriptions = dummyMembers.filter(m => m.plan.status === 'active').length
  const expiredSubscriptions = dummyMembers.filter(m => m.plan.status === 'expired').length
  const suspendedSubscriptions = dummyMembers.filter(m => m.plan.status === 'suspended').length
  const totalRevenue = dummyMembers.reduce((sum, m) => sum + m.totalPaid, 0)

  const handleSubscriptionAction = (action: string, subscription: Member) => {
    setSelectedSubscription(subscription)
    setActionType(action as 'modify' | 'cancel' | 'suspend')
  }

  const executeAction = () => {
    if (!selectedSubscription || !actionType) return

    switch (actionType) {
      case 'modify':
        alert(`Modify subscription for ${selectedSubscription.name}`)
        break
      case 'cancel':
        alert(`Cancel subscription for ${selectedSubscription.name}`)
        break
      case 'suspend':
        alert(`Suspend subscription for ${selectedSubscription.name}`)
        break
    }

    setSelectedSubscription(null)
    setActionType(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage member subscriptions and billing</p>
        </div>
      </div>

      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeSubscriptions}</p>
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
                <p className="text-3xl font-bold text-red-600">{expiredSubscriptions}</p>
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
                <p className="text-3xl font-bold text-yellow-600">{suspendedSubscriptions}</p>
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
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
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
                  placeholder="Search by member name or ID..."
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

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
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
              {paginatedSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage  />
                        <AvatarFallback>
                          {subscription.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{subscription.name}</p>
                        <p className="text-sm text-gray-500">{subscription.memberId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{subscription.plan.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.plan.status)}>
                      {subscription.plan.status.charAt(0).toUpperCase() + subscription.plan.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(subscription.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(subscription.nextBillingDate).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(subscription.plan.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubscriptionAction('modify', subscription)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubscriptionAction('suspend', subscription)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubscriptionAction('cancel', subscription)}
                      >
                        <X className="w-4 h-4" />
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubscriptions.length)} of {filteredSubscriptions.length} results
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

      {/* Action Dialog */}
      <Dialog open={!!selectedSubscription && !!actionType} onOpenChange={() => {
        setSelectedSubscription(null)
        setActionType(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'modify' && 'Modify Subscription'}
              {actionType === 'cancel' && 'Cancel Subscription'}
              {actionType === 'suspend' && 'Suspend Subscription'}
            </DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage  />
                  <AvatarFallback>
                    {selectedSubscription.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedSubscription.name}</p>
                  <p className="text-sm text-gray-500">{selectedSubscription.plan.name}</p>
                </div>
              </div>

              {actionType === 'modify' && (
                <div className="space-y-3">
                  <div>
                    <Label>New Plan</Label>
                    <Select defaultValue={selectedSubscription.plan.id}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic-monthly">Basic Monthly</SelectItem>
                        <SelectItem value="premium-monthly">Premium Monthly</SelectItem>
                        <SelectItem value="elite-monthly">Elite Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {actionType === 'cancel' && (
                <div className="space-y-3">
                  <div>
                    <Label>Cancellation Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member-request">Member Request</SelectItem>
                        <SelectItem value="payment-failure">Payment Failure</SelectItem>
                        <SelectItem value="policy-violation">Policy Violation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
                  setSelectedSubscription(null)
                  setActionType(null)
                }}>
                  Cancel
                </Button>
                {actionType ? (
                  <Button onClick={executeAction}>
                    Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
