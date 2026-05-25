"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  Code2,
  CreditCard,
  Database,
  Download,
  FileText,
  Globe,
  Key,
  Lock,
  Mail,
  QrCode,
  RefreshCw,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Tag,
  User,
  UserCog,
  Users,
  Webhook,
  Zap,
} from "lucide-react"
import Link from "next/link"

// MEMBER FLOW DATA

const memberSteps = [
  {
    step: "01",
    icon: Globe,
    title: "Browse plans",
    description:
      "Visit the Plans page to compare monthly and annual membership tiers. Each plan lists its features and pricing clearly. A one-time registration fee is charged on signup, the exact amount is set by the gym and shown at checkout.",
    detail: "/plans",
    detailLabel: "Go to Plans",
  },
  {
    step: "02",
    icon: User,
    title: "Register in 3 steps",
    description:
      "The registration wizard collects your personal information, an emergency contact, and your chosen plan. Everything is saved securely before payment.",
    detail: null,
    detailLabel: null,
    substeps: ["Personal info & credentials", "Emergency contact details", "Plan selection & start date"],
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Pay via Paystack",
    description:
      "A Paystack checkout collects your first month's plan fee plus the one-time registration fee. Your card is saved for automatic future renewals, no manual payments needed.",
    detail: null,
    detailLabel: null,
  },
  {
    step: "04",
    icon: QrCode,
    title: "Get your digital membership card",
    description:
      "Your account is created instantly after payment. Log in to see your personalised digital membership card, complete with a unique QR code tied to your member ID.",
    detail: null,
    detailLabel: null,
  },
  {
    step: "05",
    icon: Smartphone,
    title: "Check in at the gym",
    description:
      "At the entrance, show your QR code or have staff scan it from the member info screen. No physical card required, your phone is your pass.",
    detail: null,
    detailLabel: null,
  },
  {
    step: "06",
    icon: RefreshCw,
    title: "Manage your subscription",
    description:
      "From your billing dashboard you can switch between any available plan at any time. Your new plan takes effect on the next billing date, no overpayment, no hassle. You can also open the Paystack customer portal directly to update your saved card details.",
    detail: null,
    detailLabel: null,
  },
]

const memberDashboardCards = [
  {
    icon: BarChart3,
    title: "Overview",
    items: ["Days since joining", "Days until next billing", "Next payment amount"],
  },
  {
    icon: CreditCard,
    title: "Membership Status",
    items: ["Current plan name & price", "Next billing date", "Plan features list", "Link to Paystack customer portal"],
  },
  {
    icon: QrCode,
    title: "Digital Card & QR",
    items: ["Full-screen QR code display", "Member ID", "Plan and join date", "Print or screenshot support"],
  },
  {
    icon: RefreshCw,
    title: "Billing & Plans",
    items: [
      "Current plan highlighted",
      "All available monthly & annual plans",
      "One-click upgrade / downgrade",
      "Confirmation dialog before switching",
    ],
  },
]

// ADMIN FLOW DATA

const adminSections = [
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    color: "bg-blue-50 text-blue-600",
    features: [
      "Total members & active subscriptions",
      "Monthly and cumulative revenue",
      "New members this month",
      "Plan distribution breakdown",
      "Export dashboard as PDF",
    ],
  },
  {
    icon: Users,
    title: "Member Management",
    color: "bg-purple-50 text-purple-600",
    features: [
      "Search and filter member list",
      "View full member profile (contact, emergency info, medical notes)",
      "Edit member details",
      "Add internal notes to a member",
      "Activate / deactivate accounts",
      "Export all members as CSV",
    ],
  },
  {
    icon: Tag,
    title: "Plan Management",
    color: "bg-green-50 text-green-600",
    features: [
      "Create new plans (synced to Paystack automatically)",
      "Edit plan name, price, interval, and features",
      "Delete plans (removes from Paystack too)",
      "Set plans as active or inactive",
      "Mark a plan as 'Most Popular'",
    ],
  },
  {
    icon: CreditCard,
    title: "Subscriptions",
    color: "bg-orange-50 text-orange-600",
    features: [
      "View all subscriptions with status",
      "Filter by active / cancelled / expired",
      "Edit subscription details",
      "Cancel a subscription (disables it on Paystack)",
    ],
  },
  {
    icon: FileText,
    title: "Transactions",
    color: "bg-yellow-50 text-yellow-600",
    features: [
      "Full transaction history with filters",
      "View transaction details (reference, amount, gateway)",
      "Issue full or partial refunds (processed via Paystack)",
      "Refund reason recorded and stored",
    ],
  },
  {
    icon: UserCog,
    title: "Admin Team",
    color: "bg-red-50 text-red-600",
    features: [
      "Invite new admins by email",
      "Assign roles: admin or superadmin",
      "Edit admin profile and permissions",
      "Superadmin-only actions: issue refunds, update settings",
      "Admin and above: send mass notifications, manage members and subscriptions",
    ],
  },
  {
    icon: Bell,
    title: "Announcements",
    color: "bg-slate-100 text-slate-600",
    features: [
      "Compose a subject and message from the admin panel",
      "Target by audience: all members, active subscribers, or lapsed members",
      "Emails delivered individually via Brevo, each addressed by name",
      "Delivery report shows total sent, delivered, and failed counts",
    ],
  },
  {
    icon: Settings,
    title: "Settings",
    color: "bg-teal-50 text-teal-600",
    features: [
      "Update the registration fee without redeploying",
      "Changes take effect immediately for new registrations",
      "Superadmin access only",
    ],
  },
]

// ARCHITECTURE DATA

const techStack = [
  { icon: Code2, name: "Next.js 15", role: "Full-stack React framework (App Router)", color: "text-slate-700" },
  { icon: Database, name: "PostgreSQL + Prisma", role: "Relational database with type-safe ORM", color: "text-blue-600" },
  { icon: CreditCard, name: "Paystack", role: "Plans, subscriptions, transactions, refunds, webhooks", color: "text-green-600" },
  { icon: Mail, name: "Brevo (email)", role: "Transactional email, OTP, welcome, notifications", color: "text-purple-600" },
  { icon: Zap, name: "Zustand", role: "Client-side state (auth, plans, sidebar)", color: "text-orange-500" },
  { icon: Server, name: "Nodemailer + Brevo API", role: "Dual email path: SMTP for dev, API for production", color: "text-teal-600" },
]

const dataFlow = [
  {
    phase: "Registration",
    color: "border-blue-400",
    badgeColor: "bg-blue-100 text-blue-700",
    steps: [
      "Member fills 3-step form on /join",
      "Paystack Inline JS opens, collects first month + registration fee",
      "On success: POST /api/transactions/verify with reference + form data",
      "Server verifies with Paystack API, creates Account + Subscription in DB",
      "Registration fee charged via chargeAuthorization on the saved card",
      "Auth cookie set, member redirected to dashboard",
    ],
  },
  {
    phase: "Recurring Billing",
    color: "border-green-400",
    badgeColor: "bg-green-100 text-green-700",
    steps: [
      "Paystack charges the saved card on the billing date",
      "Paystack sends charge.success webhook to /api/webhooks/paystack",
      "Server verifies HMAC signature, creates a Transaction record",
      "Subscription renewalCount incremented, nextBillingDate updated",
    ],
  },
  {
    phase: "Plan Switch",
    color: "border-orange-400",
    badgeColor: "bg-orange-100 text-orange-700",
    steps: [
      "Member selects a new plan on /dashboard/billing",
      "PATCH /api/subscriptions/:id, calls PaystackService.updateSubscription",
      "Old Paystack subscription disabled, new one created on next billing date",
      "Local Subscription record updated with new planId, subscriptionCode",
    ],
  },
  {
    phase: "Refund",
    color: "border-red-400",
    badgeColor: "bg-red-100 text-red-700",
    steps: [
      "Superadmin opens refund modal, enters amount and reason",
      "POST /api/transactions/:id/refund (superadmin only)",
      "PaystackService.createRefund called with reference and optional partial amount",
      "Original transaction marked 'refunded', refundApiId and refundDate stored",
      "A companion 'refund' type Transaction created for the audit trail",
    ],
  },
]

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Rate Limiting",
    description:
      "Every API route is rate-limited per IP. Auth endpoints allow 10 req/min, payment verification 5 req/min, general routes 60 req/min. Returns 429 with Retry-After.",
  },
  {
    icon: Globe,
    title: "Referer Validation",
    description:
      "Middleware blocks requests whose Referer header doesn't match the server's own Host. Paystack webhooks are explicitly exempted.",
  },
  {
    icon: Lock,
    title: "Auth Guards",
    description:
      "Three guard layers: auth-guard (admin-only routes), admin-guard (role + permission check), app-guard (member-only routes). JWT stored in HttpOnly cookie.",
  },
  {
    icon: Webhook,
    title: "Webhook HMAC",
    description:
      "Paystack webhook handler verifies the X-Paystack-Signature using HMAC-SHA512 before processing any event.",
  },
  {
    icon: Key,
    title: "Role Hierarchy",
    description:
      "Three roles: member, admin, superadmin. Refunds and settings updates require superadmin. Admin invites require admin or above.",
  },
]

const apiGroups = [
  { prefix: "/api/auth", methods: "POST (sign-in, admin sign-in, sign-out)", note: "Rate limited: 10/min" },
  { prefix: "/api/members", methods: "GET, POST, PATCH, DELETE", note: "Admin access; /me for self" },
  { prefix: "/api/plans", methods: "GET, POST, PATCH, DELETE", note: "Public GET; mutations admin-only" },
  { prefix: "/api/subscriptions", methods: "GET, PATCH, POST (cancel)", note: "Members see own; admins see all" },
  { prefix: "/api/transactions", methods: "GET, POST (verify, refund)", note: "Refund: superadmin only" },
  { prefix: "/api/admins", methods: "GET, POST (invite), PATCH, DELETE", note: "Admin access only" },
  { prefix: "/api/analytics", methods: "GET (dashboard, plans)", note: "Admin only" },
  { prefix: "/api/settings", methods: "GET (public), PATCH (superadmin)", note: "Only safe keys exposed publicly" },
  { prefix: "/api/webhooks/paystack", methods: "POST", note: "External, exempt from middleware" },
]

// PAGE

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Documentation</Badge>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">How SwayFitness Works</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A complete guide for members, admins, and anyone who wants to understand what's under the hood.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="users" className="w-full">
            {/* 
             <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-12">
              <TabsTrigger value="users" className="text-base">
                <Users className="w-4 h-4 mr-2" />
                For Users & Admins
              </TabsTrigger>
              <TabsTrigger value="architecture" className="text-base">
                <Code2 className="w-4 h-4 mr-2" />
                Architecture
              </TabsTrigger>
              
            </TabsList>
            */}

            {/* TAB 1: USERS & ADMINS */}
            <TabsContent value="users" className="space-y-16">

              {/* Member Journey */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Member Journey</h2>
                    <p className="text-gray-500">From first visit to regular check-in</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {memberSteps.map((s, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex gap-5">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                              <s.icon className="w-6 h-6 text-orange-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-50 px-2 py-0.5 rounded">
                                Step {s.step}
                              </span>
                              <h3 className="text-lg font-bold text-slate-800">{s.title}</h3>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-3">{s.description}</p>
                            {s.substeps && (
                              <ul className="space-y-1 mb-3">
                                {s.substeps.map((sub, j) => (
                                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {s.detailLabel && s.detail && (
                              <Link href={s.detail} className="text-orange-500 text-sm font-medium hover:underline inline-flex items-center gap-1">
                                {s.detailLabel}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Member Dashboard Features */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">What's in your dashboard</h2>
                    <p className="text-gray-500">Everything a member can see and do after signing in</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {memberDashboardCards.map((card, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <card.icon className="w-5 h-5 text-orange-500" />
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {card.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Admin Sections */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
                    <p className="text-gray-500">
                      Accessible at <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">/admin</code> - separate auth from the member portal
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {adminSections.map((section, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className={`w-8 h-8 rounded-lg ${section.color} flex items-center justify-center`}>
                            <section.icon className="w-4 h-4" />
                          </div>
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.features.map((f, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Card className="border-0 bg-orange-500 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
                  <p className="text-orange-100 mb-6">Registration takes under five minutes.</p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/join">
                      <Button className="bg-white text-orange-500 hover:bg-orange-50">
                        Join Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/plans">
                      <Button variant="outline" className="border-white/40 text-white hover:bg-orange-400 bg-transparent">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: ARCHITECTURE */}
            <TabsContent value="architecture" className="space-y-16">

              {/* Tech Stack */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tech Stack</h2>
                    <p className="text-gray-500">The core technologies the system is built on</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {techStack.map((t, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-5 flex gap-4 items-start">
                        <t.icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${t.color}`} />
                        <div>
                          <div className="font-bold text-slate-800">{t.name}</div>
                          <div className="text-sm text-gray-500 mt-0.5">{t.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Data Flows */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Data Flows</h2>
                    <p className="text-gray-500">Step-by-step traces for the four main system operations</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {dataFlow.map((flow, i) => (
                    <Card key={i} className={`border-l-4 ${flow.color} border-0 shadow-sm`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Badge className={`${flow.badgeColor} border-0`}>{flow.phase}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {flow.steps.map((step, j) => (
                            <li key={j} className="flex gap-3 text-sm text-gray-600">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                                {j + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Security Model</h2>
                    <p className="text-gray-500">Defence layers from the network edge to individual route handlers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {securityFeatures.map((f, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-6 flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <f.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* API Reference */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">API Routes</h2>
                    <p className="text-gray-500">All routes follow REST conventions and return a consistent JSON envelope</p>
                  </div>
                </div>

                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-slate-800 text-slate-300 text-xs px-5 py-3 font-mono">
                    {"{ success: boolean, data?: T, message?: string }"}
                  </div>
                  <div className="divide-y">
                    {apiGroups.map((group, i) => (
                      <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-wrap gap-x-6 gap-y-1 items-start">
                          <code className="text-sm font-mono font-bold text-slate-800 w-52 flex-shrink-0">
                            {group.prefix}
                          </code>
                          <span className="text-sm text-gray-600 flex-1">{group.methods}</span>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">{group.note}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Data Model */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Data Model</h2>
                    <p className="text-gray-500">Six core Prisma models and their relationships</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      model: "Account",
                      color: "border-blue-400",
                      fields: ["id, email, password (hashed)", "name, phone, dob, gender", "role: member | admin | superadmin", "memberId (unique QR code identifier)", "Emergency contact fields", "lastLogin, lastVisit"],
                    },
                    {
                      model: "Plan",
                      color: "border-green-400",
                      fields: ["name, description, amount", "interval: monthly | annually", "features (string[])", "code (Paystack plan code)", "apiId (Paystack internal ID)", "status: active | inactive"],
                    },
                    {
                      model: "Subscription",
                      color: "border-orange-400",
                      fields: ["status: active | cancelled | expired", "startDate, endDate, nextBillingDate", "subscriptionCode, emailToken (Paystack)", "amount, discountApplied", "cancellationDate, cancellationReason", "renewalCount"],
                    },
                    {
                      model: "Transaction",
                      color: "border-purple-400",
                      fields: ["type: subscription | registration | refund | upgrade | downgrade", "status: pending | success | failed | refunded", "amount, totalAmount, reference", "refundApiId, refundReason, refundDate", "gateway (default: paystack)"],
                    },
                    {
                      model: "Setting",
                      color: "border-teal-400",
                      fields: ["key (unique)", "value (string)", "type: string | number | boolean | json", "Used for: registration_fee and future config"],
                    },
                    {
                      model: "AccountNote",
                      color: "border-red-400",
                      fields: ["Admin notes attached to a member", "content, createdBy (admin ID)", "Linked to Account via cascade delete"],
                    },
                  ].map((m, i) => (
                    <Card key={i} className={`border-l-4 ${m.color} border-r-0 border-t-0 border-b-0 shadow-sm`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-mono">{m.model}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {m.fields.map((f, j) => (
                            <li key={j} className="text-xs text-gray-500 leading-relaxed">{f}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Email Templates */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Email Templates</h2>
                    <p className="text-gray-500">Transactional emails sent via Brevo, templated with HTML</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: "welcome.html", trigger: "New member registration" },
                    { name: "otp.html", trigger: "OTP sign-in code" },
                    { name: "new-admin.html", trigger: "Admin invite" },
                    { name: "changed-password.html", trigger: "Password change" },
                    { name: "contact.html", trigger: "Contact form submission" },
                  ].map((t, i) => (
                    <Card key={i} className="border-0 shadow-sm text-center">
                      <CardContent className="p-4">
                        <Mail className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-xs font-mono text-slate-700 font-bold mb-1">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.trigger}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
