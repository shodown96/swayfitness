import { FullAccount } from "@/types/account";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface PlanState {
    selectedAccount: FullAccount | null
    isEditUserModalOpened: boolean;
    isEditAdminModalOpened: boolean;
    isViewUserModalOpened: boolean;
    isInviteModalOpen: boolean;
    setSelectedAccount: (account: FullAccount | null) => void

    openEditUserModal: (account: FullAccount) => void
    setIsEditUserModalOpened: (opened: boolean) => void

    openViewUserModal: (account: FullAccount) => void
    setIsViewUserModalOpened: (opened: boolean) => void

    openInviteModalOpen: () => void
    setIsInviteModalOpen: (opened: boolean) => void


    openEditAdminModalOpen: (account: FullAccount) => void
    setIsEditAdminModalOpen: (opened: boolean) => void

}

export const useAdminStore = create<PlanState>()(
    persist(
        (set) => ({
            selectedAccount: null,
            isEditUserModalOpened: false,
            isViewUserModalOpened: false,
            isEditAdminModalOpened: false,
            isInviteModalOpen: false,
            setIsInviteModalOpen: (opened) => set({ isInviteModalOpen: opened }),
            setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
            openEditUserModal: (account) => set({
                selectedAccount: account,
                isEditUserModalOpened: true
            }),
            openViewUserModal: (account) => set({
                selectedAccount: account,
                isViewUserModalOpened: true
            }),
            openEditAdminModalOpen: (account) => set({
                selectedAccount: account,
                isEditAdminModalOpened: true
            }),
            openInviteModalOpen: () => set({ isInviteModalOpen: true }),
            setIsEditUserModalOpened: (opened) => set({ isEditUserModalOpened: opened }),
            setIsEditAdminModalOpen: (opened) => set({ isEditAdminModalOpened: opened }),
            setIsViewUserModalOpened: (opened) => set({ isViewUserModalOpened: opened })
        }),
        {
            name: "admin-storage",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)
