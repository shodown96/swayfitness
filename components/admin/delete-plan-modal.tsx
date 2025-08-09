"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlansService } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

interface DeletePlanModalProps {
  onActionComplete?: () => void
}

export default function DeletePlanModal({ onActionComplete }: DeletePlanModalProps) {
  const { isDeleteModalOpen, setIsDeleteModalOpen, selectedPlan } = usePlanStore()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePlan = async () => {
    if (!selectedPlan) return
    
    try {
      setIsDeleting(true)
      const response = await PlansService.delete(selectedPlan.id)
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        })
        setIsDeleteModalOpen(false)
        onActionComplete?.()
      } else {
        throw new Error(response.message || "Failed to delete plan")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete plan",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
    }
  }

  const hasActiveSubscriptions = selectedPlan?._count?.subscriptions && selectedPlan._count.subscriptions > 0

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Delete Plan</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedPlan?.name}"</span>?
          </p>
          
          {hasActiveSubscriptions && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Warning</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This plan has <span className="font-semibold">{selectedPlan?._count?.subscriptions} active member{(selectedPlan?._count?.subscriptions || 0) !== 1 ? 's' : ''}</span>. 
                    Deleting it may affect their subscriptions and access to gym facilities.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> Consider deactivating the plan instead of deleting it to preserve historical data and member records.
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeletePlan} 
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? "Deleting..." : "Delete Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}