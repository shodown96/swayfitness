import { MemberRegistrationParamsType } from "@/lib/validations"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

// Fields that must never be persisted to localStorage
const SENSITIVE_FIELDS: (keyof MemberRegistrationParamsType)[] = ["password", "confirmPassword"]

export type PersistedFormValues = Omit<MemberRegistrationParamsType, "password" | "confirmPassword">

interface RegistrationState {
  // Form values (no passwords)
  savedValues: Partial<PersistedFormValues>
  // Which step the user was on
  savedStep: number

  // Actions
  saveProgress: (values: Partial<MemberRegistrationParamsType>, step: number) => void
  clearProgress: () => void
}

const EMPTY: Partial<PersistedFormValues> = {}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      savedValues: EMPTY,
      savedStep: 0,

      saveProgress: (values, step) => {
        // Strip sensitive fields before persisting
        const safe = { ...values } as Partial<MemberRegistrationParamsType>
        for (const key of SENSITIVE_FIELDS) delete safe[key]
        set({ savedValues: safe as Partial<PersistedFormValues>, savedStep: step })
      },

      clearProgress: () => set({ savedValues: EMPTY, savedStep: 0 }),
    }),
    {
      name: "registration-progress",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
