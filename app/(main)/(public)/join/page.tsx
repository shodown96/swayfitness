"use client"

import MemberRegistrationForm from "@/components/forms/MemberRegistrationForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import { PATHS } from "@/lib/constants/paths"
import { formatPrice, getNextPaymentDate, REGISTRATION_FEE } from "@/lib/plans"
import { PlansService } from "@/lib/services/plans.service"
import { useAuthStore } from "@/lib/stores/authStore"
import { usePlanStore } from "@/lib/stores/planStore"
import type { MemberRegistrationParamsType } from "@/lib/validations"
import { SignInResponse } from "@/types/responses"
import Paystack from '@paystack/inline-js'
import { isToday } from "date-fns"
import { Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function JoinPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const { plans, setPlans, selectPlan, selectedPlan } = usePlanStore()

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

  const handleSubmit = async (values: MemberRegistrationParamsType) => {
    try {
      setLoading(true)
      console.log(values)
      const popup = new Paystack()
      await popup.checkout({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: values.email,
        amount: Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE),
        planCode: String(selectedPlan?.code),
        subscriptionStartDate: isToday(new Date(values.startDate)) ? undefined : values.startDate,
        onSuccess: async (transaction) => {
          console.log(transaction);
          const toastId = toast.loading("Verifying transaction")
          const result = await mainClient.post<SignInResponse>(API_ENDPOINTS.Transactions.VerifyPaystackTransaction, {
            reference: transaction.reference,
            registrationData: values
          })
          toast.dismiss(toastId)
          if (result.success && result.data) {
            toast.success("Successful", { duration: 10000 })
            setUser(result.data.user)
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push(PATHS.Dashboard)
          } else {
            toast.error(ERROR_MESSAGES.UnexpectedError)
          }
          setLoading(false)
        },
        onLoad: (response) => {
          // console.log("onLoad: ", response);
        },
        onCancel: () => {
          console.log("onCancel");
          setLoading(false)
        },
        onError: (error) => {
          toast.error(error.message)
          // /Failed to subscribe. Please try again.
          console.log("Error: ", error.message);
          setLoading(false)
        }
      })

      console.log(values)
      // Redirect to dashboard
      // router.push(PATHS.Dashboard)
    } catch (error) {
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalToday = selectedPlan ? selectedPlan.price + REGISTRATION_FEE : REGISTRATION_FEE


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">Join Our Fitness Family</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your membership registration below and start your transformation journey today.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <MemberRegistrationForm onFormSubmit={handleSubmit} preSelectedPlan={selectedPlan?.id} loading={loading}/>
              </CardContent>
            </Card>

            {/* Member Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <Link href="/login" className="text-orange-500 hover:text-orange-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Plan Change Notice */}
              <Card className="mb-6 bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-sm text-orange-800">
                    <strong>💡 Tip:</strong> You can change your plan anytime during registration. The pricing will
                    update automatically.
                  </p>
                </CardContent>
              </Card>

              {/* Selected Plan Display */}
              {selectedPlan && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Selected Plan
                      {selectedPlan.popular && <Badge className="bg-orange-500 text-white">Most Popular</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedPlan.name}</h3>
                    <div className="mb-4">
                      {selectedPlan.oldPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(selectedPlan.oldPrice)}/{selectedPlan.interval}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-orange-500">
                        {formatPrice(selectedPlan.price)}/{selectedPlan.interval}
                      </p>
                      {selectedPlan.oldPrice && (
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                          Save 15%
                        </Badge>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {selectedPlan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {selectedPlan.features.length > 4 && (
                        <li className="text-gray-500">+ {selectedPlan.features.length - 4} more features</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Selected Plan:</span>
                    <span className="font-semibold">{selectedPlan ? formatPrice(selectedPlan.price) : "₦0"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Registration Fee:</span>
                    <div className="text-right">
                      <span className="font-semibold">{formatPrice(REGISTRATION_FEE)}</span>
                      <p className="text-xs text-gray-500">(one-time)</p>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Today:</span>
                    <span className="text-orange-500">{formatPrice(totalToday)}</span>
                  </div>
                  {selectedPlan && (
                    <div className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold mb-1">Next Payment:</p>
                      <p>
                        {formatPrice(selectedPlan.price)} on {getNextPaymentDate(selectedPlan.interval)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
