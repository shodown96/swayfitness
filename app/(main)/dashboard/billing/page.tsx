"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/plans"
import { PlansService } from "@/lib/services/plans.service"
import { usePlanStore } from "@/lib/stores/planStore"
import { useAuthStore } from "@/lib/stores/authStore"
import { Plan } from "@prisma/client"
import { AlertCircle, ArrowRight, CheckCircle, CreditCard, Crown, ExternalLink, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UserData {
    id: string
    memberId: string
    name: string
    email: string
    phone: string
    plan: {
        id: string
        name: string
        amount: number
        interval: string
        features: string[]
        status: string
        nextBilling: string
        joinDate: string
    }
}

export default function PlansPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)

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

    const handlePlanUpgrade = async (newPlan: Plan) => {
        setIsUpgrading(true)

        try {
            // Implement this

            toast.success("You've successfully switched to ${newPlan.name}. Your next billing will reflect the new plan.")
        } catch (error) {
            toast("There was an error updating your plan. Please try again.")
        } finally {
            setIsUpgrading(false)
        }
    }

    const getPlanType = (planId: string): "current" | "upgrade" | "downgrade" | "switch" => {
        if (!user) return "switch"

        const currentPlan = user.subscription?.plan
        const targetPlan = plans.find(v => v.id === planId)

        if (planId === user.subscription?.planId) return "current"

        if (currentPlan && targetPlan) {
            if (targetPlan.amount > currentPlan.amount) return "upgrade"
            if (targetPlan.amount < currentPlan.amount) return "downgrade"
        }

        return "switch"
    }

    const getButtonText = (planType: string) => {
        switch (planType) {
            case "current":
                return "Current Plan"
            case "upgrade":
                return "Upgrade"
            case "downgrade":
                return "Downgrade"
            default:
                return "Switch Plan"
        }
    }

    const getButtonVariant = (planType: string) => {
        switch (planType) {
            case "current":
                return "secondary"
            case "upgrade":
                return "default"
            default:
                return "outline"
        }
    }

    if (!user) {
        return null
    }

    const availablePlans = Object.values(plans)
    const monthlyPlans = availablePlans.filter((plan) => plan.interval === "monthly")
    const annualPlans = availablePlans.filter((plan) => plan.interval === "annually")

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Plans & Billing</h1>
                <p className="text-gray-600">Manage your membership plan and billing information</p>
            </div>

            {/* Current Plan Card */}
            {user.subscription?.plan ? (
                <Card className="mb-8 border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                                <Crown className="w-5 h-5 text-orange-500 mr-2" />
                                Current Plan
                            </span>
                            <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Active
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{user.subscription?.plan.name}</h3>
                                <p className="text-3xl font-bold text-orange-500 mb-4">
                                    {formatPrice(user.subscription?.plan.amount)}
                                    <span className="text-lg text-gray-600">/{user.subscription?.plan.interval}</span>
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Next billing:</span>
                                        <span className="font-medium">{user.subscription?.nextBillingDate ? new Date(user.subscription?.nextBillingDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Member since:</span>
                                        <span className="font-medium">{new Date(user.subscription?.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() => window.open("https://paystack.com/customer-portal", "_blank")}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Manage Billing
                                </Button>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">Current Benefits:</h4>
                                <ul className="space-y-2">
                                    {user.subscription?.plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

            {/* Available Plans */}
            <div className="space-y-8">
                {/* Monthly Plans */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Monthly Plans</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {monthlyPlans.map((plan) => {
                            const planType = getPlanType(plan.id)
                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative ${plan.popular ? "border-orange-500 shadow-lg" : ""} ${planType === "current" ? "bg-orange-50 border-orange-200" : ""}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-orange-500 text-white">
                                                <Star className="w-3 h-3 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="text-center">
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <div className="text-3xl font-bold text-slate-800">
                                            {formatPrice(plan.amount)}
                                            <span className="text-lg text-gray-600">/month</span>
                                        </div>
                                        {plan.amount && (
                                            <p className="text-sm text-gray-500 line-through">{formatPrice(plan.amount)}/month</p>
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full"
                                                    variant={getButtonVariant(planType) as any}
                                                    disabled={planType === "current"}
                                                    onClick={() => setSelectedPlan(plan)}
                                                >
                                                    {planType === "current" && <CheckCircle className="w-4 h-4 mr-2" />}
                                                    {planType !== "current" && <ArrowRight className="w-4 h-4 mr-2" />}
                                                    {getButtonText(planType)}
                                                </Button>
                                            </DialogTrigger>

                                            {planType !== "current" && (
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Plan Change</DialogTitle>
                                                    </DialogHeader>

                                                    <div className="space-y-4">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Plan Change Summary:</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Current Plan:</span>
                                                                    <span>{user.subscription?.plan.name}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>New Plan:</span>
                                                                    <span className="font-semibold">{plan.name}</span>
                                                                </div>
                                                                <Separator />
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>New Monthly Cost:</span>
                                                                    <span>{formatPrice(plan.amount)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                            <p>
                                                                Your plan will be updated immediately. The new billing amount will be prorated and
                                                                reflected in your next billing cycle on{" "}
                                                                {user.subscription?.nextBillingDate ? new Date(user.subscription.nextBillingDate).toLocaleDateString() : "-"}.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => handlePlanUpgrade(plan)}
                                                            disabled={isUpgrading}
                                                            className="bg-orange-500 hover:bg-orange-600"
                                                        >
                                                            {isUpgrading ? "Processing..." : `Confirm ${getButtonText(planType)}`}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            )}
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Annual Plans */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Annual Plans</h2>
                    <p className="text-gray-600 mb-6">Save up to 15% with annual billing</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {annualPlans.map((plan) => {
                            const planType = getPlanType(plan.id)
                            const savings = plan.amount ? plan.amount - plan.amount : 0

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative ${planType === "current" ? "bg-orange-50 border-orange-200" : ""}`}
                                >
                                    {savings > 0 && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-green-500 text-white">Save {formatPrice(savings)}</Badge>
                                        </div>
                                    )}

                                    <CardHeader className="text-center">
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <div className="text-3xl font-bold text-slate-800">
                                            {formatPrice(plan.amount)}
                                            <span className="text-lg text-gray-600">/year</span>
                                        </div>
                                        {plan.amount && (
                                            <p className="text-sm text-gray-500 line-through">{formatPrice(plan.amount)}/year</p>
                                        )}
                                        <p className="text-sm text-green-600 font-medium">
                                            {formatPrice(Math.round(plan.amount / 12))}/month when paid annually
                                        </p>
                                    </CardHeader>

                                    <CardContent>
                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full"
                                                    variant={getButtonVariant(planType) as any}
                                                    disabled={planType === "current"}
                                                    onClick={() => setSelectedPlan(plan)}
                                                >
                                                    {planType === "current" && <CheckCircle className="w-4 h-4 mr-2" />}
                                                    {planType !== "current" && <ArrowRight className="w-4 h-4 mr-2" />}
                                                    {getButtonText(planType)}
                                                </Button>
                                            </DialogTrigger>

                                            {planType !== "current" && (
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Plan Change</DialogTitle>
                                                    </DialogHeader>

                                                    <div className="space-y-4">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Plan Change Summary:</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Current Plan:</span>
                                                                    <span>{user.subscription?.plan.name}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>New Plan:</span>
                                                                    <span className="font-semibold">{plan.name}</span>
                                                                </div>
                                                                <Separator />
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>New Annual Cost:</span>
                                                                    <span>{formatPrice(plan.amount)}</span>
                                                                </div>
                                                                {savings > 0 && (
                                                                    <div className="flex justify-between text-green-600 font-semibold">
                                                                        <span>Annual Savings:</span>
                                                                        <span>{formatPrice(savings)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                            <p>
                                                                Your plan will be updated immediately. You'll be charged the prorated amount for the
                                                                annual plan, and your billing cycle will switch to annual.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => handlePlanUpgrade(plan)}
                                                            disabled={isUpgrading}
                                                            className="bg-orange-500 hover:bg-orange-600"
                                                        >
                                                            {isUpgrading ? "Processing..." : `Confirm ${getButtonText(planType)}`}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            )}
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">
                        Have questions about changing your plan? Our support team is here to help.
                    </p>
                    <div className="flex space-x-4">
                        <Button variant="outline">Contact Support</Button>
                        <Button variant="outline">View FAQ</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
