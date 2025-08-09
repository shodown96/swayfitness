"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency, getStatusColor, } from "@/lib/dumps/admin-data"
import { MembersService } from "@/lib/services/members.service"
import { useAdminStore } from "@/lib/stores/adminStore"
import { FullAccount } from "@/types/account"
import { AccountStatus } from "@prisma/client"
import { toast } from "sonner"

export default function UserDetailModal({
  onActionComplete,
}: {
  onActionComplete: (user: FullAccount) => void
}) {
  const { 
    selectedAccount, 
    isViewUserModalOpened,
    setSelectedAccount,
    setIsViewUserModalOpened
   } = useAdminStore()

  const suspendAccount = async (user: FullAccount) => {

    if (!selectedAccount) return;
    try {
      const data = await MembersService.updateByAdmin(user.id, { status: AccountStatus.suspended })
      if (data.success) {
        toast.success("Successfuly suspended member")
        setSelectedAccount(null)
        onActionComplete(user)
      }
    } catch (err) {
      console.error("Suspend failed", err)
    }
  }

  const activateAccount = async (user: FullAccount) => {
    if (!selectedAccount) return;
    try {
      const data = await MembersService.updateByAdmin(user.id, { status: AccountStatus.active })
      if (data.success) {
        toast.success("Successfuly activated member")
        setSelectedAccount(null)
        onActionComplete(user)
      }
    } catch (err) {
      console.error("Suspend failed", err)
    }
  }

  const deleteAccount = async (user: FullAccount) => {
    if (!selectedAccount) return;
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const data = await MembersService.delete(user.id)
        if (data.success) {
          toast.success("Successfuly deleted member")
          setSelectedAccount(null)
          onActionComplete(user)
        }
      } catch (err) {
        console.error("Delete failed", err)
      }
    }
  }

  const handleEditMember = () => {

  }
  return (
    <Dialog open={isViewUserModalOpened} onOpenChange={setIsViewUserModalOpened}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
        </DialogHeader>
        {selectedAccount && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage />
                <AvatarFallback className="text-xl">
                  {selectedAccount.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{selectedAccount.name}</h3>
                <p className="text-gray-600">{selectedAccount.email}</p>
                <Badge className={getStatusColor(selectedAccount.status)}>
                  {selectedAccount.status.charAt(0).toUpperCase() + selectedAccount.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Member ID:</span> {selectedAccount.memberId}</div>
                  <div><span className="text-gray-600">Phone:</span> {selectedAccount.phone}</div>
                  <div><span className="text-gray-600">Date of Birth:</span> {selectedAccount.dob ? new Date(selectedAccount.dob).toLocaleDateString() : 'N/A'}</div>
                  <div><span className="text-gray-600">Gender:</span> {selectedAccount.gender}</div>
                  <div><span className="text-gray-600">Join Date:</span> {new Date(selectedAccount.createdAt).toLocaleDateString()}</div>
                  <div><span className="text-gray-600">Address:</span> {selectedAccount.address}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Subscription Details</h4>
                {selectedAccount.subscription ? (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Plan:</span> {selectedAccount.subscription.plan.name}</div>
                    <div><span className="text-gray-600">Price:</span> {formatCurrency(Number(selectedAccount.subscription.plan.price))}/{selectedAccount.subscription.plan.interval}</div>
                    <div><span className="text-gray-600">Next Billing:</span> {selectedAccount.subscription.nextBillingDate ? (new Date(selectedAccount.subscription.nextBillingDate).toLocaleDateString()) : 'N/A'}</div>
                  </div>
                ) : null}
              </div>
              <div>
                <h4 className="font-semibold mb-3">Emergency Contact Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Name:</span> {selectedAccount.emergencyContactName}</div>
                  <div><span className="text-gray-600">Phone:</span> {selectedAccount.emergencyContactPhone}</div>
                  <div><span className="text-gray-600">Relationship:</span> {selectedAccount.emergencyContactRelationship}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleEditMember}>
                Edit Member
              </Button>
              {selectedAccount?.status === 'active' ? (
                <Button className="border-red-600 !bg-white text-black border hover:border-red-700" onClick={() => suspendAccount(selectedAccount)}>
                  Suspend Member
                </Button>
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => activateAccount(selectedAccount)}>
                  Activate Member
                </Button>
              )}
              <Button variant="destructive" onClick={() => deleteAccount(selectedAccount)}>
                Delete Member
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog >
  )
}
