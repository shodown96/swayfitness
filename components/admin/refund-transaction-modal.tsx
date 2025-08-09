import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminTransactionStore } from "@/lib/stores/adminTransactionStore"
import { Button } from "../ui/button"


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
    }

    return (
        <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Refund Transaction</DialogTitle>
                </DialogHeader>
                <div className="mb-4">Refund processed for ${selectedTransaction?.reference}</div>
                <div className="flex justidy-end gap-3">
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
