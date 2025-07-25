"use client"

import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { MemberRegistrationParamsSchema, type MemberRegistrationParamsType } from "@/lib/validations"
import PersonalInfoForm from "./registration-steps/PersonalInfoForm"
import EmergencyContactForm from "./registration-steps/EmergencyContactForm"
import PlanSelectionForm from "./registration-steps/PlanSelectionForm"
import { Check } from "lucide-react"

interface MemberRegistrationFormProps {
  onFormSubmit: (values: MemberRegistrationParamsType) => void
  preSelectedPlan?: string
  loading?: boolean
}

export default function MemberRegistrationForm({ onFormSubmit, preSelectedPlan, loading }: MemberRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const formik = useFormik<MemberRegistrationParamsType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "male",
      password: "",
      confirmPassword: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      startDate: (new Date()).toISOString(),
      planId: preSelectedPlan || "",
      medicalConditions: "",
      agreeToTerms: false,
    },
    onSubmit: async (values) => {
      onFormSubmit(values)
    },
    validateOnBlur: true,
    validationSchema: MemberRegistrationParamsSchema,
  })

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const steps = ["Personal Information", "Emergency Contact", "Membership Details"]

  useEffect(() => {
    if (loading) {
      formik.setSubmitting(true)
    } else {
      formik.setSubmitting(false)
    }
  }, [loading])

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${index <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${index < currentStep ? "bg-orange-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="font-medium text-gray-800">{steps[currentStep]}</p>
        </div>
      </div>

      {/* Form Steps */}
      {currentStep === 0 && <PersonalInfoForm formik={formik} onNext={nextStep} />}
      {currentStep === 1 && <EmergencyContactForm formik={formik} onNext={nextStep} onPrev={prevStep} />}
      {currentStep === 2 && <PlanSelectionForm formik={formik} onPrev={prevStep} />}
    </div>
  )
}
