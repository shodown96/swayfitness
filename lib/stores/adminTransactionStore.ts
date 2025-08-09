import { FullTransaction } from '@/types/plan'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface TransactionStore {
    selectedTransaction: FullTransaction | null
    isDetailModalOpen: boolean
    isRefundModalOpen: boolean
    isModalOpen: boolean

    setSelectedTransaction: (transaction: FullTransaction | null) => void
    openDetailModalOpen: (transaction: FullTransaction) => void
    openRefundModalOpen: (transaction: FullTransaction) => void
    setIsDetailModalOpen: (isOpen: boolean) => void
    setIsRefundModalOpen: (isOpen: boolean) => void
    setIsModalOpen: (isOpen: boolean) => void
}

export const useAdminTransactionStore = create<TransactionStore>()(
    persist(
        (set) => ({
            selectedTransaction: null,
            isDetailModalOpen: false,
            isRefundModalOpen: false,
            isModalOpen: false,

            setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

            openDetailModalOpen: (transaction) =>
                set({
                    selectedTransaction: transaction,
                    isDetailModalOpen: true,
                }),

            openRefundModalOpen: (transaction) =>
                set({
                    selectedTransaction: transaction,
                    isRefundModalOpen: true,
                }),

            setIsDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
            setIsRefundModalOpen: (isOpen) => set({ isRefundModalOpen: isOpen }),
            setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
        }),
        {
            name: 'transaction-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
