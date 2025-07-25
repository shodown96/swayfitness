"use client"

import { Input } from "@/components/custom/Input"
import { InputPassword } from "@/components/custom/InputPassword"
import { type AdminLoginParamsType } from "@/lib/validations"
import { FormikProps } from "formik"
import { Loader2, Lock, Mail, Shield } from "lucide-react"

interface AdminSignInFormProps {
  formik: FormikProps<AdminLoginParamsType>
  isLoading?: boolean
}

export default function AdminSignInForm({ formik, isLoading }: AdminSignInFormProps) {

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, isValid } = formik

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="email"
        name="email"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter admin email"
        type="email"
        value={values.email}
        error={errors.email}
        touched={touched.email}
        leftIcon={Mail}
        label="Admin Email"
      />

      <InputPassword
        id="password"
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter password"
        value={values.password}
        error={errors.password}
        touched={touched.password}
        leftIcon={Lock}
        label="Password"
      />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Admin Sign In
          </>
        )}
      </button>
    </form>
  )
}
