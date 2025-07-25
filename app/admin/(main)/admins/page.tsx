"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminsService } from "@/lib/services/admins.service"
import { FullAccount } from "@/types/account"
import { AccountRole, AccountStatus } from "@prisma/client"
import { Edit, Mail, Shield, UserPlus, UserX } from 'lucide-react'
import { useEffect, useState } from "react"

export default function AdminsPage() {
  const [admins, setAdmins] = useState<FullAccount[]>([])
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<FullAccount | null>(null)
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Admin" as "Super Admin" | "Admin"
  })

  const handleInviteAdmin = async () => {
    try {
      await AdminsService.invite(inviteForm.email, inviteForm.role)
      setInviteForm({ name: "", email: "", role: "Admin" })
      setIsInviteOpen(false)
      alert(`Invitation sent to ${inviteForm.email}`)

      const { data } = await AdminsService.getAll()
      if (data) {
        setAdmins(data?.items)
      }
    } catch (err) {
      alert("Failed to invite admin")
      console.error(err)
    }
  }


  const handleAdminAction = async (action: string, admin: FullAccount) => {
    try {
      if (action === "deactivate") {
        if (confirm(`Deactivate ${admin.name}?`)) {
          await AdminsService.update(admin.id, { status: AccountStatus.inactive })
        }
      } else if (action === "delete") {
        if (confirm(`Delete ${admin.name}?`)) {
          await AdminsService.delete(admin.id)
        }
      } else if (action === "edit") {
        setSelectedAdmin(admin)
        return
      }

      // Refresh list after any change
      const { data } = await AdminsService.getAll()
      if (data) {
        setAdmins(data?.items)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to process action.")
    }
  }


  const currentAdmin = JSON.parse(localStorage.getItem('gym_admin') || '{}')
  const canManageAdmins = currentAdmin.role === 'Super Admin'

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await AdminsService.getAll()
      if (data) {
        setAdmins(data?.items)
      }
    }
    fetchAdmins()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
        </div>
        {canManageAdmins && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Administrator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteForm.role} onValueChange={(value: "Super Admin" | "Admin") => setInviteForm({ ...inviteForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteAdmin}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-3xl font-bold text-gray-800">{admins.length}</p>
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
                  {admins.filter(a => a.role === AccountRole.superadmin).length}
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
                  {admins.filter(a => a.status === 'active').length}
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
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {canManageAdmins && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
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
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge className={admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  {canManageAdmins && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAdminAction('edit', admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAdminAction('deactivate', admin)}
                          disabled={admin.id === currentAdmin.id}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </div>
  )
}
