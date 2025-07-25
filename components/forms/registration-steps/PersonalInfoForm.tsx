"use client"

import type { FormikProps } from "formik"
import { User, Mail, Phone, Calendar } from "lucide-react"
import { Input } from "@/components/custom/Input"
import { InputPassword } from "@/components/custom/InputPassword"
import { Select } from "@/components/custom/Select"
import type { MemberRegistrationParamsType } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface PersonalInfoFormProps {
  formik: FormikProps<MemberRegistrationParamsType>
  onNext: () => void
}

export default function PersonalInfoForm({ formik, onNext }: PersonalInfoFormProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik

  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    let score = 0
    if (password.length >= 8) score += 25
    if (/[a-z]/.test(password)) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9]/.test(password)) score += 25

    if (score <= 25) return { score, text: "Weak", color: "bg-red-500" }
    if (score <= 50) return { score, text: "Fair", color: "bg-orange-500" }
    if (score <= 75) return { score, text: "Good", color: "bg-yellow-500" }
    return { score, text: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(values.password)

  const validateStep = () => {
    const stepFields = ["name", "email", "phone", "dob", "gender", "password", "confirmPassword"]
    const hasErrors = stepFields.some((field) => errors[field as keyof typeof errors])
    const hasValues = stepFields.every((field) => values[field as keyof typeof values])
    return !hasErrors && hasValues
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
        <p className="text-gray-600 mt-2">Tell us about yourself</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          id="name"
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Enter your full name"
          value={values.name}
          error={errors.name}
          touched={touched.name}
          leftIcon={User}
          label="Full Name *"
        />

        <Input
          id="email"
          name="email"
          type="email"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Enter your email"
          value={values.email}
          error={errors.email}
          touched={touched.email}
          leftIcon={Mail}
          label="Email Address *"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          id="phone"
          name="phone"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="+234 xxx xxx xxxx"
          value={values.phone}
          error={errors.phone}
          touched={touched.phone}
          leftIcon={Phone}
          label="Phone Number *"
        />

        <Input
          id="dob"
          name="dob"
          type="date"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.dob}
          error={errors.dob}
          touched={touched.dob}
          leftIcon={Calendar}
          label="Date of Birth *"
        />
      </div>

      <Select
        name="gender"
        value={values.gender}
        onChange={(value) => setFieldValue("gender", value)}
        onBlur={handleBlur}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
        ]}
        error={errors.gender}
        touched={touched.gender}
        label="Gender *"
        placeholder="Select gender"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <InputPassword
            id="password"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Enter your password"
            value={values.password}
            error={errors.password}
            touched={touched.password}
            label="Password *"
          />

          {values.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Password strength:</span>
                <span
                  className={`font-medium ${passwordStrength.score >= 75 ? "text-green-600" : passwordStrength.score >= 50 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <Progress value={passwordStrength.score} className="h-2" />
            </div>
          )}
        </div>

        <InputPassword
          id="confirmPassword"
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Confirm your password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          label="Confirm Password *"
        />
      </div>

      <div className="flex justify-end pt-6">
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
