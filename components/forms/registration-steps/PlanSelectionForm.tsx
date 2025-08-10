"use client"

import { Input } from "@/components/custom/Input"
import { Select } from "@/components/custom/Select"
import { Textarea } from "@/components/custom/Textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/plans"
import { PlansService } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import type { MemberRegistrationParamsType } from "@/lib/validations"
import { Plan } from "@prisma/client"
import type { FormikProps } from "formik"
import { Calendar, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface PlanSelectionFormProps {
  formik: FormikProps<MemberRegistrationParamsType>
  onPrev: () => void
}

export default function PlanSelectionForm({ formik, onPrev }: PlanSelectionFormProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, isSubmitting } = formik
  const {selectedPlan, setSelectedPlan, plans, setPlans} = usePlanStore()

  useEffect(() => {
    const plan = plans.find(v=>v.id===values.planId)
    if (values.planId && plan) {
      setSelectedPlan(plan)
    }
  }, [values.planId])
  
    useEffect(() => {
      const getplans = async () => {
        const result = await PlansService.getAll()
        if (result.success && result.data) {
          setPlans(result.data.items)
        }
      }
      if (!plans.length) {
        getplans()
      }
    }, [plans.length])

  const validateStep = () => {
    const stepFields = ["planId"]
    const hasErrors = stepFields.some((field) => errors[field as keyof typeof errors])
    const hasValues = stepFields.every((field) => values[field as keyof typeof values])
    return !hasErrors && hasValues && values.agreeToTerms
  }

  const planOptions = Object.values(plans).map((plan) => ({
    value: plan.id,
    label: `${plan.name} - ${formatPrice(plan.amount)}/${plan.interval}`,
  }))

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Membership Details</h2>
        <p className="text-gray-600 mt-2">Choose your plan and start date</p>
      </div>

      <Select
        name="planId"
        value={values.planId}
        onChange={(value) => {
          setFieldValue("planId", value)
          setSelectedPlan(plans.find(v=>v.id===value) || null)
        }}
        onBlur={handleBlur}
        options={planOptions}
        error={errors.planId}
        touched={touched.planId}
        label="Selected Plan *"
        placeholder="Select a membership plan"
      />

      {selectedPlan ? (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">{selectedPlan.name}</h3>
          <p className="text-sm text-orange-700 mb-2">{selectedPlan.description}</p>
          <p className="text-lg font-bold text-orange-600">
            {formatPrice(selectedPlan.amount)}/{selectedPlan.interval}
          </p>
        </div>
      ) : null}

      <Input
        id="startDate"
        name="startDate"
        type="date"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.startDate || new Date().toISOString().split("T")[0]}
        error={errors.startDate}
        touched={touched.startDate}
        leftIcon={Calendar}
        label="Start Date *"
        min={new Date().toISOString().split("T")[0]}
      />

      <Textarea
        id="medicalConditions"
        name="medicalConditions"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.medicalConditions || ""}
        placeholder="Please describe any medical conditions or injuries we should be aware of..."
        rows={4}
        label="Medical Conditions or Injuries (Optional)"
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          checked={values.agreeToTerms}
          onCheckedChange={(checked) => setFieldValue("agreeToTerms", checked)}
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the{" "}
          <a href="/terms" className="text-orange-500 hover:underline">
            terms and conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-orange-500 hover:underline">
            privacy policy
          </a>
        </Label>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Previous
        </Button>

        <Button
          type="submit"
          onClick={() => handleSubmit()}
          disabled={!validateStep() || isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </div>
  )
}
