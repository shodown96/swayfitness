"use client"

import SignInForm from "@/components/forms/SignInForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { PATHS } from "@/lib/constants/paths"
import { useAuthStore } from "@/lib/stores/authStore"
import type { SignInParamsType } from "@/lib/validations"
import { SignInResponse } from "@/types/responses"
import { Dumbbell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { setUser } = useAuthStore()

  const handleSubmit = async (values: SignInParamsType) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await mainClient.post<SignInResponse>(API_ENDPOINTS.Auth.SignIn, values)
      if (result.success && result.data) {
        setUser(result.data.user)
        router.push("/dashboard")
      } else {
        setError(result.message || ERROR_MESSAGES.UnexpectedError)
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Dumbbell className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Member Login</CardTitle>
            <p className="text-orange-100 mt-2">Access your fitness journey</p>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-6">{error}</div>
            )}

            <SignInForm onFormSubmit={handleSubmit} isLoading={isLoading} />

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href={PATHS.Join} className="text-orange-600 hover:text-orange-700 font-medium">
                  Join now
                </Link>
              </p>
              {/* <p className="text-xs text-gray-500">Demo: john@example.com / password123</p> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
