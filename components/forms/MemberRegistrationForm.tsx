"use client"

import { useFormik } from "formik"
import { useEffect } from "react"
import { MemberRegistrationParamsSchema, type MemberRegistrationParamsType } from "@/lib/validations"
import { useRegistrationStore } from "@/lib/stores/registrationStore"
import { usePlanStore } from "@/lib/stores/planStore"
import PersonalInfoForm from "./registration-steps/PersonalInfoForm"
import EmergencyContactForm from "./registration-steps/EmergencyContactForm"
import PlanSelectionForm from "./registration-steps/PlanSelectionForm"
import { Check } from "lucide-react"

interface MemberRegistrationFormProps {
  onFormSubmit: (values: MemberRegistrationParamsType) => Promise<void>
  preSelectedPlan?: string
}

const STEPS = ["Personal Information", "Emergency Contact", "Membership Details"]

export default function MemberRegistrationForm({ onFormSubmit, preSelectedPlan }: MemberRegistrationFormProps) {
  const { savedValues, savedStep, saveProgress } = useRegistrationStore()
  const { selectedPlan } = usePlanStore()

  const formik = useFormik<MemberRegistrationParamsType>({
    initialValues: {
      name: savedValues.name ?? "",
      email: savedValues.email ?? "",
      phone: savedValues.phone ?? "",
      dob: savedValues.dob ?? "",
      gender: savedValues.gender ?? "male",
      password: "",
      confirmPassword: "",
      emergencyContactName: savedValues.emergencyContactName ?? "",
      emergencyContactPhone: savedValues.emergencyContactPhone ?? "",
      emergencyContactRelationship: savedValues.emergencyContactRelationship ?? "",
      startDate: savedValues.startDate ?? new Date().toISOString(),
      planId: savedValues.planId ?? preSelectedPlan ?? selectedPlan?.id ?? "",
      avatarUrl: savedValues.avatarUrl ?? "",
      medicalConditions: savedValues.medicalConditions ?? "",
      agreeToTerms: false, // never persist consent — must be actively re-ticked each session
    },
    onSubmit: async (values) => {
      await onFormSubmit(values)
    },
    validateOnBlur: true,
    validationSchema: MemberRegistrationParamsSchema,
  })

  // Keep track of which step we're on
  const currentStep = savedStep

  const setCurrentStep = (step: number | ((prev: number) => number)) => {
    const next = typeof step === "function" ? step(savedStep) : step
    saveProgress(formik.values, next)
  }

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  // Persist form values whenever they change (debounced via Formik's values ref)
  useEffect(() => {
    saveProgress(formik.values, currentStep)
  }, [formik.values])

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${index <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${index < currentStep ? "bg-orange-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Label */}
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <p className="font-medium text-gray-800">{STEPS[currentStep]}</p>
        </div>
      </div>

      {/* Form Steps */}
      {currentStep === 0 && <PersonalInfoForm formik={formik} onNext={nextStep} />}
      {currentStep === 1 && <EmergencyContactForm formik={formik} onNext={nextStep} onPrev={prevStep} />}
      {currentStep === 2 && <PlanSelectionForm formik={formik} onPrev={prevStep} />}
    </div>
  )
}
