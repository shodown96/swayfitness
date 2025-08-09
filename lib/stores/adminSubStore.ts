import { FullSubscription } from '@/types/plan'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ActionType = "modify" | "cancel" | "suspend" | null;

interface SubscriptionStore {
    selectedSubscription: FullSubscription | null;
    isModalOpened: boolean;
    actionType: ActionType;
    setSelectedSubscription: (subscription: FullSubscription | null) => void;
    openModal: (actionType: ActionType, subscription?: FullSubscription) => void;
    closeModal: () => void;
    setIsModalOpened: (opened: boolean) => void;
}


export const useAdminSubscriptionStore = create<SubscriptionStore>()(
    persist(
        (set) => ({
            selectedSubscription: null,
            isModalOpened: false,
            actionType: null,
            setSelectedSubscription: (id) => set({ selectedSubscription: id }),
            openModal: (actionType, subscription) =>
                set({
                    isModalOpened: true,
                    actionType,
                    selectedSubscription: subscription
                }),
            closeModal: () =>
                set({
                    isModalOpened: false,
                    actionType: null,
                    selectedSubscription: null
                }),
            setIsModalOpened: (opened) => set({ isModalOpened: opened })

        }),
        {
            name: "admin-sub-storage",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)
