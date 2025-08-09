import { Plan } from "@prisma/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"


interface PlanState {
  plans: Plan[]
  selectedPlan: Plan | null
  setPlans: (plans: Plan[]) => void
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, plan: Partial<Plan>) => void
  deletePlan: (id: string) => void
  setSelectedPlan: (plan: Plan | null) => void
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: [],
      selectedPlan: null,
      setPlans: (plans) => set({ plans }),
      addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, planData) =>
        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? { ...plan, ...planData } : plan)),
        })),
      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== id),
        })),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
    }),
    {
      name: "plan-storage",
    },
  ),
)
