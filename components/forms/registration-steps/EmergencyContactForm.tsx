"use client"

import type { FormikProps } from "formik"
import { User, Phone } from "lucide-react"
import { Input } from "@/components/custom/Input"
import { Select } from "@/components/custom/Select"
import type { MemberRegistrationParamsType } from "@/lib/validations"
import { Button } from "@/components/ui/button"

interface EmergencyContactFormProps {
  formik: FormikProps<MemberRegistrationParamsType>
  onNext: () => void
  onPrev: () => void
}

export default function EmergencyContactForm({ formik, onNext, onPrev }: EmergencyContactFormProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik

  const validateStep = () => {
    const stepFields = ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"]
    const hasErrors = stepFields.some((field) => errors[field as keyof typeof errors])
    const hasValues = stepFields.every((field) => values[field as keyof typeof values])
    return !hasErrors && hasValues
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Emergency Contact</h2>
        <p className="text-gray-600 mt-2">Who should we contact in case of emergency?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          id="emergencyContactName"
          name="emergencyContactName"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Enter contact name"
          value={values.emergencyContactName}
          error={errors.emergencyContactName}
          touched={touched.emergencyContactName}
          leftIcon={User}
          label="Emergency Contact Name *"
        />

        <Input
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="+234 xxx xxx xxxx"
          value={values.emergencyContactPhone}
          error={errors.emergencyContactPhone}
          touched={touched.emergencyContactPhone}
          leftIcon={Phone}
          label="Emergency Contact Phone *"
        />
      </div>

      <Select
        name="emergencyContactRelationship"
        value={values.emergencyContactRelationship}
        onChange={(value) => setFieldValue("emergencyContactRelationship", value)}
        onBlur={handleBlur}
        options={[
          { value: "spouse", label: "Spouse" },
          { value: "parent", label: "Parent" },
          { value: "sibling", label: "Sibling" },
          { value: "friend", label: "Friend" },
          { value: "other", label: "Other" },
        ]}
        error={errors.emergencyContactRelationship}
        touched={touched.emergencyContactRelationship}
        label="Relationship *"
        placeholder="Select relationship"
      />

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!validateStep()}
          className="bg-orange-500 hover:bg-orange-600 px-8"
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
