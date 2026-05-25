"use client"

import { Button } from "@/components/ui/button"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { PATHS } from "@/lib/constants/paths"
import { mainClient } from "@/lib/axios"
import { useAuthStore } from "@/lib/stores/authStore"
import { useRegistrationStore } from "@/lib/stores/registrationStore"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

type State = "loading" | "success" | "error"

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { clearProgress } = useRegistrationStore()
  const [state, setState] = useState<State>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const ran = useRef(false)

  // Paystack sends both `reference` and `trxref` — accept either
  const reference = searchParams.get("reference") ?? searchParams.get("trxref")

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!reference) {
      setState("error")
      setErrorMessage("No payment reference found in the URL.")
      return
    }

    mainClient
      .post(API_ENDPOINTS.Transactions.VerifyPaystackTransaction, { reference })
      .then((res) => {
        if (res.success && res.data?.user) {
          setUser(res.data.user)
          clearProgress() // wipe persisted form data now that registration is done
          setState("success")
          setTimeout(() => router.push(PATHS.Dashboard), 2500)
        } else {
          setState("error")
          setErrorMessage(res.message || "Payment verification failed. Please contact support.")
        }
      })
      .catch(() => {
        setState("error")
        setErrorMessage("An unexpected error occurred while verifying your payment.")
      })
  }, [reference])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 w-full max-w-md text-center space-y-6">
        {/* Brand mark */}
        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow">
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

        {state === "loading" && (
          <>
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-800">Confirming your payment…</h1>
              <p className="text-sm text-gray-500">Please wait while we verify your transaction.</p>
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-800">Payment confirmed!</h1>
              <p className="text-sm text-gray-500">
                Welcome to SwayFitness. Redirecting you to your dashboard…
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
              <div className="bg-orange-500 h-1 rounded-full animate-[grow_2.5s_ease-in-out_forwards]" />
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-slate-800">Verification failed</h1>
              <p className="text-sm text-gray-500">{errorMessage}</p>
              {reference && (
                <p className="text-xs text-gray-400 font-mono break-all">ref: {reference}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                onClick={() => {
                  setState("loading")
                  ran.current = false
                  // re-trigger useEffect
                  setTimeout(() => { ran.current = false }, 0)
                  window.location.reload()
                }}
              >
                Retry
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={PATHS.Contact}>Contact Support</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
