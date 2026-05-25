"use client"

import MemberRegistrationForm from "@/components/forms/MemberRegistrationForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { formatPrice, getNextPaymentDate } from "@/lib/plans"
import { PlansService } from "@/lib/services/plans.service"
import { SettingsService } from "@/lib/services/settings.service"
import { usePlanStore } from "@/lib/stores/planStore"
import type { MemberRegistrationParamsType } from "@/lib/validations"
import { Check } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function JoinPage() {
  const [registrationFee, setRegistrationFee] = useState(0)
  const [plansLoading, setPlansLoading] = useState(true)
  const [feeLoading, setFeeLoading] = useState(true)
  const { plans, setPlans, setSelectedPlan, selectedPlan } = usePlanStore()

  useEffect(() => {
    const getPlans = async () => {
      try {
        const result = await PlansService.getAll()
        if (result.success && result.data) {
          setPlans(result.data.items)
        }
      } finally {
        setPlansLoading(false)
      }
    }
    getPlans()
  }, [])

  // Fetch the registration fee from the DB-backed settings API
  useEffect(() => {
    SettingsService.getRegistrationFee().then((fee) => {
      setRegistrationFee(fee)
      setFeeLoading(false)
    })
  }, [])

  const isPageLoading = plansLoading || feeLoading

  const handleSubmit = async (values: MemberRegistrationParamsType) => {
    if (!selectedPlan) {
      toast.error("Please select a plan before continuing.")
      return
    }
    try {
      const res = await mainClient.post<{ url: string }>(API_ENDPOINTS.Checkout.Initialize, {
        planId: selectedPlan.id,
        registrationData: values,
      })
      if (res.success && res.data?.url) {
        // Redirect to Paystack's hosted checkout — amount is computed server-side
        window.location.href = res.data.url
      } else {
        toast.error(res.message || "Failed to start payment. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  const totalToday = selectedPlan ? selectedPlan.amount + registrationFee : registrationFee

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <p className="text-xl font-bold text-slate-800">SwayFitness</p>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-3 text-gray-500">
          <svg
            className="animate-spin h-5 w-5 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Loading membership plans…</span>
        </div>

        {/* Skeleton plan cards preview */}
        <div className="w-full max-w-5xl px-4 mt-2">
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border p-6 animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-9 bg-gray-200 rounded w-1/3 mx-auto" />
                <div className="space-y-2 pt-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex gap-2 items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" />
                      <div className="h-3 bg-gray-200 rounded flex-1" />
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
                <MemberRegistrationForm onFormSubmit={handleSubmit} preSelectedPlan={selectedPlan?.id} />
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
                        {formatPrice(selectedPlan.amount)}/{selectedPlan.interval}
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
                          <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
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
                    <span className="font-semibold">{selectedPlan ? formatPrice(selectedPlan.amount) : "₦0"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Registration Fee:</span>
                    <div className="text-right">
                      <span className="font-semibold">{formatPrice(registrationFee)}</span>
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
                        {formatPrice(selectedPlan.amount)} on {getNextPaymentDate(selectedPlan.interval)}
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
