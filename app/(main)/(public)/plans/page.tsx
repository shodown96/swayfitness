"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlansService } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import { formatCurrency } from "@/lib/utils"
import { Check } from 'lucide-react'
import Link from "next/link"
import { useEffect } from "react"

export default function PlansPage() {
  const { plans, setPlans, setSelectedPlan, selectedPlan } = usePlanStore()

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

  // const comparisonFeatures = [
  //   { feature: "Gym Equipment Access", basic: true, premium: true, elite: true },
  //   { feature: "Locker Room Access", basic: true, premium: true, elite: true },
  //   { feature: "Mobile App", basic: true, premium: true, elite: true },
  //   { feature: "Group Fitness Classes", basic: false, premium: true, elite: true },
  //   { feature: "Personal Training Sessions", basic: false, premium: "1/month", elite: "Unlimited" },
  //   { feature: "Nutrition Consultation", basic: false, premium: true, elite: true },
  //   { feature: "Custom Meal Planning", basic: false, premium: false, elite: true },
  //   { feature: "Recovery Services", basic: false, premium: false, elite: true },
  //   { feature: "Guest Passes", basic: false, premium: "2/month", elite: "Unlimited" },
  //   { feature: "VIP Locker Access", basic: false, premium: false, elite: true },
  //   { feature: "Priority Booking", basic: false, premium: true, elite: true },
  //   { feature: "Dedicated Concierge", basic: false, premium: false, elite: true },
  // ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">Choose Your Fitness Journey</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible plans designed for every lifestyle and budget. Start your transformation today.
          </p>
        </div>
      </section>

      {/* Registration Fee Notice */}
      <section className="py-8 bg-orange-50 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-white p-4 rounded-lg border border-orange-200 text-center">
            <p className="text-slate-800">
              <strong>New Member Registration:</strong> All new members pay a one-time registration fee of{" "}
              <span className="text-orange-600 font-bold">₦7,500</span> in addition to their first month's payment.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden hover:shadow-lg transition-shadow ${plan.popular ? "ring-2 ring-orange-500" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-white">Most Popular</Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    {plan.oldPrice && <p className="text-sm text-gray-500 line-through">{plan.oldPrice}</p>}
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-800">{formatCurrency(plan.amount)}</span>
                      {/* <span className="text-gray-600 ml-1">{plan.period}</span> */}
                    </div>
                    {plan.oldPrice && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                        Save 15%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <div className="bg-red-100-">
                  <CardContent className="flex flex-col justify-between h-max">
                    <ul className="space-y-3 mb-6 flex-1 min-h-[150px]">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/join?plan=${plan.id}`}>
                      <Button
                        className={`w-full ${plan.popular ? "bg-orange-500 hover:bg-orange-600" : "bg-slate-800 hover:bg-slate-700"} text-white`}
                      >
                        Select Plan
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Compare All Plans</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See exactly what's included in each membership tier
            </p>
          </div>

          {/* <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm border">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-slate-800">Features</th>
                  <th className="text-center p-4 font-semibold text-slate-800">Basic</th>
                  <th className="text-center p-4 font-semibold text-slate-800 bg-orange-50">Premium</th>
                  <th className="text-center p-4 font-semibold text-slate-800">Elite</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-700">{item.feature}</td>
                    <td className="p-4 text-center">
                      {typeof item.basic === "boolean" ? (
                        item.basic ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{item.basic}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-orange-50">
                      {typeof item.premium === "boolean" ? (
                        item.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{item.premium}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof item.elite === "boolean" ? (
                        item.elite ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{item.elite}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of members who have already transformed their lives with SwayFitness.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  )
}
