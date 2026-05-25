import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle,
  CreditCard,
  QrCode,
  Shield,
  Smartphone,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const features = [
    {
      icon: QrCode,
      title: "Digital Membership Card",
      description:
        "Every member gets a unique QR code card. Staff scan it at the door — no physical cards, no manual registers.",
    },
    {
      icon: CreditCard,
      title: "Paystack-Powered Payments",
      description:
        "Secure card payments with automatic recurring billing. Members manage their subscriptions directly from their dashboard.",
    },
    {
      icon: Smartphone,
      title: "Member Self-Service",
      description:
        "Upgrade, downgrade, or switch plans without calling anyone. Paystack handles the proration and rebilling automatically.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Revenue trends, plan distribution, active subscriptions, and member growth — all in one admin dashboard.",
    },
    {
      icon: Users,
      title: "Full Member Management",
      description:
        "Admin profiles, emergency contacts, medical notes, activity history, and one-click CSV export for every member.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Superadmins, admins, and members each see exactly what they need. Invite team members and manage permissions.",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Choose a Plan",
      description: "Browse monthly and annual membership tiers. See exactly what's included before committing.",
      cta: "View Plans",
      href: "/plans",
    },
    {
      number: "02",
      title: "Register & Pay",
      description:
        "Complete a 3-step registration — personal info, emergency contact, plan selection — then pay securely via Paystack.",
      cta: null,
      href: null,
    },
    {
      number: "03",
      title: "Walk In with Your QR Code",
      description:
        "Your digital membership card is ready instantly. Show the QR code at the door or let staff scan it from the check-in screen.",
      cta: null,
      href: null,
    },
  ]

  const testimonials = [
    {
      initials: "JA",
      name: "Jennifer A.",
      quote:
        "Signing up took me five minutes and I had my digital card before I even left the page. Everything just works.",
    },
    {
      initials: "MT",
      name: "Marcus T.",
      quote:
        "I upgraded my plan from the dashboard in two clicks. No calls, no paperwork. That's how it should be.",
    },
    {
      initials: "PS",
      name: "Priya S.",
      quote:
        "The QR check-in is seamless. I just open my phone and walk through. The community here is amazing too.",
    },
  ]

  const stats = [
    { value: "< 5 min", label: "Registration time" },
    { value: "100%", label: "Digital — no paper" },
    { value: "2 clicks", label: "To switch plans" },
    { value: "24/7", label: "Self-service access" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Decorative orange ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-orange-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-orange-500/5 pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <Badge className="mb-6 bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/20">
            <Zap className="w-3 h-3 mr-1" />
            Fully Digital Gym Management
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your gym.{" "}
            <span className="text-orange-400">Fully managed.</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SwayFitness gives members a seamless digital experience, from registration and payments to
            QR check-ins and subscription management, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg w-full sm:w-auto">
                Join Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 px-8 py-6 text-lg w-full sm:w-auto bg-transparent"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-orange-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything your gym needs, nothing it doesn't
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Built specifically for fitness businesses that want to run lean and modern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                    <f.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (3 steps) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Up and running in three steps</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              No in-person visits required. Register, pay, and get your digital card — all online.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-orange-200 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-4">{step.description}</p>
                  {step.cta && step.href && (
                    <Link href={step.href} className="text-orange-500 font-medium hover:underline inline-flex items-center gap-1">
                      {step.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="border-slate-300">
                <Activity className="w-4 h-4 mr-2" />
                See the full member and admin guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plans teaser */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Flexible plans for every lifestyle
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              Monthly and annual memberships with clear pricing and no hidden fees.
              All plans include access to your digital membership card, QR check-in, and full subscription management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plans">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8">
                  View All Plans
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  Join Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Members love it</h2>
            <p className="text-xl text-gray-500">Real feedback from the SwayFitness community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <div key={s} className="w-4 h-4 bg-orange-400 rounded-sm" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <span className="font-semibold text-slate-800">{t.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to join the family?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Registration takes less than five minutes. Your digital membership card is ready the moment you pay.
          </p>
          <Link href="/join">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg">
              Get Started — Join SwayFitness
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
