"use client"

import RefundTransactionDetailModal from "@/components/admin/refund-transaction-modal"
import TransactionDetailModal from "@/components/admin/transaction-modal"
import TableSkeleton from "@/components/custom/TableSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import useAPIQuery from "@/hooks/use-api-query"
import { TransactionsService } from "@/lib/services/transactions.service"
import { useAdminTransactionStore } from "@/lib/stores/adminTransactionStore"
import { delayDebounceFn, formatCurrency } from "@/lib/utils"
import { FullTransaction } from "@/types/plan"
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, DollarSign, Download, Eye, RefreshCw, Search, TrendingUp } from 'lucide-react'
import { useEffect, useState } from "react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<FullTransaction[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { setQuery, query, pagination, setPagination } = useAPIQuery()
  const [stats, setStats] = useState({
    successfulTransactions: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
    totalRevenue: 0,
  })
  const {
    openDetailModalOpen,
    openRefundModalOpen
  } = useAdminTransactionStore()

  const onActionComplete = async () => {
    const { data } = await TransactionsService.getAll()
    if (data) {
      setTransactions(data.items)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setQuery({
      page: 1,
      search: "",
      status: undefined,
      type: undefined
    })
    await fetchData()
    setRefreshing(false)
  }

  const handleExport = async () => {
    try {
      // const { data } = await TransactionsService.export(query)
      // if (data) {
      //   // Create and trigger download
      //   const blob = new Blob([data], { type: 'text/csv' })
      //   const url = window.URL.createObjectURL(blob)
      //   const link = document.createElement('a')
      //   link.href = url
      //   link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      //   link.click()
      //   window.URL.revokeObjectURL(url)
      // }
    } catch (err) {
      console.error("Failed to export transactions", err)
    }
  }

  const fetchData = async () => {
    if (!refreshing) setFetching(true)
    try {
      const { data } = await TransactionsService.getAll(query)
      if (data) {
        setTransactions(data.items)
        setPagination(data)
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err)
    } finally {
      setFetching(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await TransactionsService.getStats()
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

  const handleTypeFilter = (value: string) => {
    setQuery({ type: value === "all" ? undefined : value, page: 1 })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-600" />
      case 'refunded':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
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
  }, [])

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Transaction Management</h1>
            <p className="text-gray-600 mt-1">Monitor all payment transactions and refunds</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Transactions
            </Button>
            <Button onClick={handleRefresh} variant={'secondary'} disabled={refreshing}>
              Refresh transactions
            </Button>
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-3xl font-bold text-green-600">{stats.successfulTransactions}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-red-600">{stats.failedTransactions}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingTransactions}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <RefreshCw className="w-6 h-6 text-yellow-600" />
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
                  <DollarSign className="w-6 h-6 text-blue-600" />
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
                    placeholder="Search by member name or reference..."
                    value={query.search || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={query.status || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={query.type || "all"} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({pagination.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableSkeleton
                  loading={fetching || refreshing}
                  rows={transactions.length || 1}
                  columns={7}>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.account.name}</p>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold">
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.reference}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModalOpen(transaction)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {transaction.status === 'success' && transaction.type !== 'refund' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRefundModalOpen(transaction)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
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

        {/* Transaction Status Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3">Successful Transactions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Payment processed successfully</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Funds received and confirmed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Eligible for refund processing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-3">Failed/Pending Transactions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>Pending: Awaiting payment confirmation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Failed: Payment declined or error</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Refunded: Amount returned to member</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      <TransactionDetailModal onActionComplete={onActionComplete} />
      <RefundTransactionDetailModal onActionComplete={onActionComplete} />
    </>
  )
}