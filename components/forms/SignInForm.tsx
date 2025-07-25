"use client"

import { useFormik } from "formik"
import { Mail, Lock, Loader2 } from "lucide-react"
import { Input } from "@/components/custom/Input"
import { InputPassword } from "@/components/custom/InputPassword"
import { SignInParamsSchema, type SignInParamsType } from "@/lib/validations"

interface SignInFormProps {
  onFormSubmit: (values: SignInParamsType) => void
  isLoading?: boolean
}

export default function SignInForm({ onFormSubmit, isLoading }: SignInFormProps) {
  const formik = useFormik<SignInParamsType>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      onFormSubmit(values)
    },
    validateOnBlur: true,
    validationSchema: SignInParamsSchema,
  })

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, isValid } = formik

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        name="email"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter your email"
        type="email"
        value={values.email}
        error={errors.email}
        touched={touched.email}
        leftIcon={Mail}
        label="Email"
      />

      <InputPassword
        id="password"
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter your password"
        value={values.password}
        error={errors.password}
        touched={touched.password}
        leftIcon={Lock}
        label="Password"
      />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  )
}
