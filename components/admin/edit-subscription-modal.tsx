"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlansService } from "@/lib/services/plans.service"
import { SubscriptionsService } from "@/lib/services/subscriptions.service" // Add this service
import { useAdminSubscriptionStore } from '@/lib/stores/adminSubStore'
import { FullPlan, FullSubscription } from '@/types/plan'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Save, Ban, Pause } from "lucide-react"

export default function EditSubscriptionModal({ onActionComplete }: {
    onActionComplete: (subscription: FullSubscription) => void
}) {
    const { actionType, selectedSubscription, isModalOpened, setIsModalOpened, closeModal } = useAdminSubscriptionStore()

    const [plans, setPlans] = useState<FullPlan[]>([])
    const [selectedPlanId, setSelectedPlanId] = useState<string>("")
    const [cancellationReason, setCancellationReason] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Reset form when modal opens or subscription changes
    useEffect(() => {
        if (selectedSubscription && isModalOpened) {
            setSelectedPlanId(selectedSubscription.plan.id)
            setCancellationReason("")
        }
    }, [selectedSubscription, isModalOpened])

    const handleModifySubscription = async () => {
        if (!selectedSubscription || !selectedPlanId) return

        setIsSubmitting(true)
        try {
            // Call your subscription modification API
            const result = await SubscriptionsService.update(selectedSubscription.id, {
                planId: selectedPlanId
            })

            if (result.success) {
                toast.success("Subscription plan updated successfully")
                onActionComplete(selectedSubscription)
                closeModal()
            } else {
                toast.error("Failed to update subscription plan")
            }
        } catch (error) {
            console.error("Failed to modify subscription:", error)
            toast.error("Failed to update subscription plan")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!selectedSubscription || !cancellationReason) {
            toast.error("Please select a cancellation reason")
            return
        }

        setIsSubmitting(true)
        try {
            // Call your subscription cancellation API
            const result = await SubscriptionsService.cancel(selectedSubscription.id, {
                cancellationReason
            })

            if (result.success) {
                toast.success("Subscription cancelled successfully")
                onActionComplete(selectedSubscription)
                closeModal()
            } else {
                toast.error("Failed to cancel subscription")
            }
        } catch (error) {
            console.error("Failed to cancel subscription:", error)
            toast.error("Failed to cancel subscription")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSuspendSubscription = async () => {
        if (!selectedSubscription) return

        setIsSubmitting(true)
        try {
            // Call your subscription suspension API
            const result = await SubscriptionsService.suspend(selectedSubscription.id)

            if (result.success) {
                toast.success("Subscription suspended successfully")
                onActionComplete(selectedSubscription)
                closeModal()
            } else {
                toast.error("Failed to suspend subscription")
            }
        } catch (error) {
            console.error("Failed to suspend subscription:", error)
            toast.error("Failed to suspend subscription")
        } finally {
            setIsSubmitting(false)
        }
    }

    const executeAction = async () => {
        if (!selectedSubscription || !actionType) return

        switch (actionType) {
            case 'modify':
                await handleModifySubscription()
                break
            case 'cancel':
                await handleCancelSubscription()
                break
            case 'suspend':
                await handleSuspendSubscription()
                break
        }
    }

    const getActionIcon = () => {
        switch (actionType) {
            case 'modify':
                return Save
            case 'cancel':
                return Ban
            case 'suspend':
                return Pause
            default:
                return Save
        }
    }

    const ActionIcon = getActionIcon()

    const isFormValid = () => {
        if (!selectedSubscription) return false

        switch (actionType) {
            case 'modify':
                return selectedPlanId && selectedPlanId !== selectedSubscription.plan.id
            case 'cancel':
                return cancellationReason.length > 0
            case 'suspend':
                return true
            default:
                return false
        }
    }
    if (!actionType) return null
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
                                <p className="text-sm text-gray-500">
                                    Current Plan: {selectedSubscription.plan.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Status: {selectedSubscription.status}
                                </p>
                            </div>
                        </div>

                        {actionType === 'modify' && (
                            <div className="space-y-2">
                                <Label>New Plan</Label>
                                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.length ? plans.map(plan => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.amount}/{plan.interval}
                                            </SelectItem>
                                        )) : null}
                                    </SelectContent>
                                </Select>
                                {selectedPlanId === selectedSubscription.plan.id && (
                                    <p className="text-sm text-amber-600">
                                        This is the current plan. Select a different plan to modify.
                                    </p>
                                )}
                            </div>
                        )}

                        {actionType === 'cancel' && (
                            <div className="space-y-2">
                                <Label>Cancellation Reason *</Label>
                                <Select value={cancellationReason} onValueChange={setCancellationReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member-request">Member Request</SelectItem>
                                        <SelectItem value="payment-failure">Payment Failure</SelectItem>
                                        <SelectItem value="policy-violation">Policy Violation</SelectItem>
                                        <SelectItem value="dissatisfied">Dissatisfied with Service</SelectItem>
                                        <SelectItem value="financial-reasons">Financial Reasons</SelectItem>
                                        <SelectItem value="moving">Moving/Relocating</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {actionType === 'suspend' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Warning:</strong> Suspending this subscription will temporarily disable
                                    the member's access to the gym facilities. The subscription can be reactivated later.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                onClick={executeAction}
                                disabled={!isFormValid() || isSubmitting}
                                className={`${actionType === 'cancel' || actionType === 'suspend'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ActionIcon className="w-4 h-4 mr-2" />
                                        Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}