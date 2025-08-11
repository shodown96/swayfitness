import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminTransactionStore } from "@/lib/stores/adminTransactionStore"
import { formatCurrency } from "@/lib/utils"
import { RefundFormParamsSchema, RefundFormParamsType } from "@/lib/validations"
import { useFormik } from 'formik'
import { AlertCircle, RefreshCw, Wallet } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { z } from 'zod'
import { Input } from "../custom/Input"
import { Select } from "../custom/Select"
import { Button } from "../ui/button"
import { TransactionsService } from "@/lib/services/transactions.service"

export default function RefundTransactionDetailModal({ onActionComplete }: {
    onActionComplete: () => Promise<void>
}) {
    const {
        selectedTransaction,
        isRefundModalOpen,
        setIsRefundModalOpen,
    } = useAdminTransactionStore()

    const processRefund = async (values: RefundFormParamsType) => {
        if (!selectedTransaction) return

        try {
            // TODO: Implement actual refund API call
            const result = await TransactionsService.refund(selectedTransaction.id, {
                refundReason: values.reason === 'other' ? values.customReason : values.reason,
                amount: Number(values.amount)
            })

            console.log('Processing refund:', {
                transactionId: selectedTransaction.id,
                reason: values.reason === 'other' ? values.customReason : values.reason,
                amount: Number(values.amount),
                originalAmount: selectedTransaction.amount
            })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("Refund processed successfully")
            await onActionComplete()
            setIsRefundModalOpen(false)
            formik.resetForm()
        } catch (error) {
            console.error('Refund failed:', error)
            toast.error("Failed to process refund")
        }
    }

    const formik = useFormik<RefundFormParamsType>({
        initialValues: {
            reason: "",
            customReason: "",
            amount: 0,
        },
        onSubmit: processRefund,
        validateOnBlur: true,
        validationSchema: RefundFormParamsSchema,
    })

    const {
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
        values,
        errors,
        touched,
        isValid,
        isSubmitting
    } = formik

    // Set default amount when transaction is selected
    useEffect(() => {
        if (selectedTransaction && isRefundModalOpen) {
            setValues({
                reason: "",
                customReason: "",
                amount: Number(selectedTransaction.amount),
            })
        }
    }, [selectedTransaction, isRefundModalOpen, setValues])

    const refundReasons = [
        { value: "duplicate-payment", label: "Duplicate Payment" },
        { value: "service-not-delivered", label: "Service Not Delivered" },
        { value: "customer-request", label: "Customer Request" },
        { value: "billing-error", label: "Billing Error" },
        { value: "fraudulent-transaction", label: "Fraudulent Transaction" },
        { value: "system-error", label: "System Error" },
        { value: "other", label: "Other (Specify)" },
    ]

    const isPartialRefund = selectedTransaction ?
        Number(values.amount) < Number(selectedTransaction.amount) : false

    return (
        <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Refund Transaction</DialogTitle>
                </DialogHeader>

                {selectedTransaction && (
                    <div className="space-y-4">
                        {/* Transaction Info */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Reference:</span>
                                <span className="font-mono text-sm">{selectedTransaction.reference}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Original Amount:</span>
                                <span className="font-semibold">{formatCurrency(Number(selectedTransaction.amount))}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Customer:</span>
                                <span className="text-sm">{selectedTransaction.account.email}</span>
                            </div>
                        </div>

                        {/* Refund Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                name="reason"
                                value={values.reason}
                                onChange={(value) => setFieldValue("reason", value)}
                                onBlur={handleBlur}
                                options={refundReasons}
                                error={errors.reason}
                                touched={touched.reason}
                                label="Refund Reason"
                                placeholder="Select refund reason"
                            />

                            {values.reason === 'other' && (
                                <Input
                                    id="customReason"
                                    name="customReason"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Please specify the reason"
                                    value={values.customReason}
                                    error={errors.customReason}
                                    touched={touched.customReason}
                                    leftIcon={AlertCircle}
                                    label="Custom Reason"
                                />
                            )}

                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter refund amount"
                                value={values.amount}
                                error={errors.amount}
                                touched={touched.amount}
                                leftIcon={Wallet}
                                max={Number(selectedTransaction.amount)}
                                label="Refund Amount"
                            />

                            {isPartialRefund && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <div className="text-sm text-amber-800">
                                            <strong>Partial Refund:</strong> You're refunding ${values.amount}{" "}
                                            out of {formatCurrency(Number(selectedTransaction.amount))}.
                                            The remaining {formatCurrency(Number(selectedTransaction.amount) - Number(values.amount || 0))}
                                            {" "}will not be refunded.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRefundModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Process Refund
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}