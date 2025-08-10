import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminTransactionStore } from "@/lib/stores/adminTransactionStore"
import { Button } from "../ui/button"
import { toast } from "sonner"


export default function RefundTransactionDetailModal({ onActionComplete }: {
    onActionComplete: () => Promise<void>
}) {
    const {
        selectedTransaction,
        isRefundModalOpen,
        setIsRefundModalOpen,
    } = useAdminTransactionStore()

    const handleRefund = async () => {
        setIsRefundModalOpen(false)
        toast.info("Not implemented yet.")
    }

    return (
        <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Refund Transaction</DialogTitle>
                </DialogHeader>
                <div className="mb-4">Refund processed for the transaction with the reference:{" "}
                    <span className="font-semibold">{selectedTransaction?.reference}</span>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsRefundModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleRefund} className="bg-blue-600 hover:bg-blue-700">
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
