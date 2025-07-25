"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PlansService, type CreatePlanData } from "@/lib/services/plans.service"
import { formatCurrency } from "@/lib/utils"
import { FullPlan } from "@/types/plan"
import { Plan, PlanInterval, PlanStatus } from "@prisma/client"
import { Copy, Edit, MoreHorizontal, Plus, Power, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function PlansPage() {
  const [plans, setPlans] = useState<FullPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [intervalFilter, setIntervalFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<FullPlan | null>(null)
  const [formData, setFormData] = useState<CreatePlanData>({
    name: "",
    description: "",
    price: 0,
    interval: PlanInterval.monthly,
    features: [""],
    status: "active",
  })
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalMembers: 0,
    averagePrice: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPlans()
    fetchStats()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await PlansService.getAllForAdmin({
        search: searchTerm,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
        interval: intervalFilter === "all" ? undefined : (intervalFilter as any),
      })
      if (response.success && response.data) {
        setPlans(response.data.items)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await PlansService.getStats()
      if (response.success && response.data) {
        setStats(response.data as any)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleCreatePlan = async () => {
    try {
      const response = await PlansService.create(formData)
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan created successfully",
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchPlans()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive",
      })
    }
  }

  const handleEditPlan = async () => {
    if (!selectedPlan) return
    try {
      const response = await PlansService.update(selectedPlan.id, formData)
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan updated successfully",
        })
        setIsEditModalOpen(false)
        resetForm()
        fetchPlans()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlan = async () => {
    if (!selectedPlan) return
    try {
      const response = await PlansService.delete(selectedPlan.id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        })
        setIsDeleteModalOpen(false)
        setSelectedPlan(null)
        fetchPlans()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const response = await PlansService.toggleStatus(plan.id)
      if (response.success) {
        toast({
          title: "Success",
          description: `Plan ${PlanStatus.active ? "deactivated" : "activated"} successfully`,
        })
        fetchPlans()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status",
        variant: "destructive",
      })
    }
  }

  const handleDuplicatePlan = async (plan: Plan) => {
    try {
      const response = await PlansService.duplicate(plan.id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan duplicated successfully",
        })
        fetchPlans()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate plan",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      interval: "monthly",
      features: [""],
      status: "active",
    })
    setSelectedPlan(null)
  }

  const openEditModal = (plan: FullPlan) => {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      interval: plan.interval,
      features: [...plan.features],
      status: plan.status,
    })
    setIsEditModalOpen(true)
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }))
  }

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter
    const matchesInterval = intervalFilter === "all" || plan.interval === intervalFilter
    return matchesSearch && matchesStatus && matchesInterval
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Plans</h1>
          <p className="text-gray-600">Manage your gym membership plans and pricing</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averagePrice)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>A list of all membership plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={intervalFilter} onValueChange={setIntervalFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intervals</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plans Table */}
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </TableCell>
                      <TableCell className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No plans found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(Number(plan.price))}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.interval}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.status === PlanStatus.active ? "default" : "secondary"}>{plan.status}</Badge>
                      </TableCell>
                      <TableCell>{plan._count.subscriptions}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleDuplicatePlan(plan)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(plan)}>
                              <Power className="mr-2 h-4 w-4" />
                              {plan.status === PlanStatus.active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPlan(plan)
                                setIsDeleteModalOpen(true)
                              }}
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Plan Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>Add a new membership plan to your gym</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., Premium Monthly"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Describe the plan benefits..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₦)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                className="col-span-3"
                placeholder="25000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interval" className="text-right">
                Interval
              </Label>
              <Select
                value={formData.interval}
                onValueChange={(value: "monthly" | "annual") => setFormData((prev) => ({ ...prev, interval: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Features</Label>
              <div className="col-span-3 space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature..."
                    />
                    {formData.features.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                  }
                />
                <Label htmlFor="status">{formData.status === "active" ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update the plan details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price (₦)
              </Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-interval" className="text-right">
                Interval
              </Label>
              <Select
                value={formData.interval}
                onValueChange={(value: "monthly" | "annual") => setFormData((prev) => ({ ...prev, interval: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Features</Label>
              <div className="col-span-3 space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature..."
                    />
                    {formData.features.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                  }
                />
                <Label htmlFor="edit-status">{formData.status === "active" ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPlan}>Update Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPlan?.name}"? This action cannot be undone.
              {selectedPlan?._count.subscriptions && selectedPlan._count.subscriptions > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This plan has {selectedPlan._count.subscriptions} active members. Deleting it may affect their
                    subscriptions.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
