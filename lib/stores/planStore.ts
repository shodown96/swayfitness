import { FullPlan } from "@/types/plan"
import { Plan } from "@prisma/client"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface StatePlan extends FullPlan {
  popular?: boolean
}
interface PlanState {
  plans: StatePlan[]
  selectedPlan: StatePlan | null
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean
  setPlans: (plans: StatePlan[]) => void
  setSelectedPlan: (plan: StatePlan | null) => void

  openCreateModalOpen: () => void
  openEditModalOpen: (plan: FullPlan) => void
  openDeleteModalOpen: (plan: FullPlan) => void

  setIsCreateModalOpen: (opened: boolean) => void
  setIsEditModalOpen: (opened: boolean) => void
  setIsDeleteModalOpen: (opened: boolean) => void
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: [],
      selectedPlan: null,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      setPlans: (plans) => set({ plans }),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),

      openCreateModalOpen: () => set({ isCreateModalOpen: true }),
      openEditModalOpen: (plan) => set({ isEditModalOpen: true, selectedPlan: plan }),
      openDeleteModalOpen: (plan) => set({ isDeleteModalOpen: true, selectedPlan: plan }),

      setIsCreateModalOpen: (opened) => set({ isCreateModalOpen: opened }),
      setIsEditModalOpen: (opened) => set({ isEditModalOpen: opened }),
      setIsDeleteModalOpen: (opened) => set({ isDeleteModalOpen: opened }),
    }),
    {
      name: "plan-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
