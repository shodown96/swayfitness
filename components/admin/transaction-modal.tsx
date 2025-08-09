import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminTransactionStore } from "@/lib/stores/adminTransactionStore"
import { formatCurrency } from "@/lib/utils"
import { AlertCircle, CheckCircle, RefreshCw, TrendingUp } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

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

export default function TransactionDetailModal({ onActionComplete }: {
    onActionComplete: () => Promise<void>
}) {
    const {
        selectedTransaction,
        isDetailModalOpen,
        setIsDetailModalOpen,
    } = useAdminTransactionStore()

    const handleRefund = async () => { }

    return (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                </DialogHeader>
                {selectedTransaction ? (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-3">Transaction Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-600">Reference:</span> {selectedTransaction.reference}</div>
                                    <div><span className="text-gray-600">Date:</span> {new Date(selectedTransaction.createdAt).toLocaleString()}</div>
                                    <div><span className="text-gray-600">Amount:</span> {formatCurrency(Number(selectedTransaction.amount))}</div>
                                    <div><span className="text-gray-600">Type:</span> {selectedTransaction.type}</div>
                                    <div><span className="text-gray-600">Payment gateway:</span> {selectedTransaction.gateway}</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Status:</span>
                                        {getStatusIcon(selectedTransaction.status)}
                                        <Badge className={getStatusColor(selectedTransaction.status)}>
                                            {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-3">Member Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-600">Name:</span> {selectedTransaction.account.name}</div>
                                    <div><span className="text-gray-600">Member ID:</span> {selectedTransaction.account.memberId}</div>
                                    <div><span className="text-gray-600">Description:</span> {selectedTransaction.description}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button onClick={() => setIsDetailModalOpen(false)} variant={'outline'}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
