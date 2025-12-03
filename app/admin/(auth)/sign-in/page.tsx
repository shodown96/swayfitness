"use client"

import AdminSignInForm from "@/components/forms/AdminSignInForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { useAuthStore } from "@/lib/stores/authStore"
import { AdminLoginParamsSchema, type AdminLoginParamsType } from "@/lib/validations"
import { SignInResponse } from "@/types/responses"
import { useFormik } from "formik"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { setUser } = useAuthStore()


  const handleSubmit = async (values: AdminLoginParamsType) => {
    setIsLoading(true)
    setError("")
    try {
      const result = await mainClient.post<SignInResponse>(API_ENDPOINTS.Auth.AdminSignIn, values)
      if (result.success && result.data) {
        setUser(result.data.user)
        router.push("/admin/dashboard")
      } else {
        setError(result.message || ERROR_MESSAGES.UnexpectedError)
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }


  const formik = useFormik<AdminLoginParamsType>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleSubmit,
    validateOnBlur: true,
    validationSchema: AdminLoginParamsSchema,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
            <p className="text-blue-100 mt-2">Secure access for administrators</p>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-6">{error}</div>
            )}

            <AdminSignInForm formik={formik} isLoading={isLoading} />

            <div className="mt-6 text-center">
              {/* <p className="text-xs text-gray-500">Demo credentials: admin@gym.com / admin123</p> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
