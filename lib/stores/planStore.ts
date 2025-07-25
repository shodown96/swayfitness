import { Plan } from "@prisma/client"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface StatePlan extends Plan {
  popular?: boolean
}
interface PlanState {
  plans: StatePlan[]
  selectedPlan: StatePlan | null
  setPlans: (plans: StatePlan[]) => void
  selectPlan: (plan: StatePlan | null) => void
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: [],
      selectedPlan: null,
      setPlans: (plans) => set({ plans }),
      selectPlan: (plan) => set({ selectedPlan: plan }),
    }),
    {
      name: "plan-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
