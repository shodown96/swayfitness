"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlansService } from "@/lib/services/plans.service"
import { useAdminSubscriptionStore } from '@/lib/stores/adminSubStore'
import { FullPlan, FullSubscription } from '@/types/plan'
import { useEffect, useState } from "react"

export default function EditSubscriptionModal({ onActionComplete }: {
    onActionComplete: (subscription: FullSubscription) => void
}) {
    const { actionType, selectedSubscription, isModalOpened, setIsModalOpened, closeModal } = useAdminSubscriptionStore()

    const [plans, setPlans] = useState<FullPlan[]>([])
    const fetchPlans = async () => {
        try {
            const { data } = await PlansService.getAllForAdmin()
            if (data) {
                setPlans(data.items)
            }
        } catch (err) {
            console.error("Failed to fetch plans", err)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const executeAction = async () => {
        if (!selectedSubscription || !actionType) return

        switch (actionType) {
            case 'modify':
                alert(`Modify subscription for ${selectedSubscription.account.name}`)
                break
            case 'cancel':
                alert(`Cancel subscription for ${selectedSubscription.account.name}`)
                break
            case 'suspend':
                alert(`Suspend subscription for ${selectedSubscription.account.name}`)
                break
        }


    }
    return (

        <Dialog open={isModalOpened} onOpenChange={setIsModalOpened}>
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
                                <AvatarImage />
                                <AvatarFallback>
                                    {selectedSubscription.account.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{selectedSubscription.account.name}</p>
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
                                            {plans.length ? plans.map(plan => (
                                                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                            )) : null}
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
                            <Button variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            {actionType ? (
                                <Button onClick={executeAction} className="bg-blue-600 hover:bg-blue-700">
                                    Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
                                </Button>
                            ) : null}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
