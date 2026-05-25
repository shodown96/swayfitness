export const BASE_API_ENDPOINT = "/api"

export const API_ENDPOINTS = {
  Checkout: {
    Initialize: "/api/checkout/initialize",
  },
  Plans: {
    Base: "/api/plans",
    AdminPlans: "/api/plans/admin",
    Stats: "/api/plans/stats",
    ById: (id: string) => `/api/plans/${id}`,
    Status: (id: string) => `/api/plans/${id}/status`,
  },
  Auth: {
    AdminSignIn: "/api/auth/admin/sign-in",
    SignOut: "/api/auth/sign-out",
    SignIn: "/api/auth/sign-in",
  },
  Admins: {
    Base: "/api/admins",
    SendNotification: "/api/admins/send-notification",
    Invite: "/api/admins/invite",
    Me: "/api/admins/me",
    Stats: "/api/admins/stats",
    AuditLogs: "/api/admins/audit-logs",
    ById: (id: string) => `/api/admins/${id}`,
  },
  Accounts: {
    Me: "/api/accounts/me",
  },
  Subscriptions: {
    Base: "/api/subscriptions",
    Stats: "/api/subscriptions/stats",
    ById: (id: string) => `/api/subscriptions/${id}`,
    Cancel: (id: string) => `/api/subscriptions/${id}/cancel`,
    Resume: (id: string) => `/api/subscriptions/${id}/resume`,
    Suspend: (id: string) => `/api/subscriptions/${id}/suspend`,
  },
  Transactions: {
    Base: "/api/transactions",
    Stats: "/api/transactions/stats",
    ById: (id: string) => `/api/transactions/${id}`,
    Refund: (id: string) => `/api/transactions/${id}/refund`,
    VerifyPaystackTransaction: '/api/transactions/verify',
    GetManageSubscriptionLink: '/api/transactions/get-subscription-link',
  },
  Members: {
    Base: "/api/members",
    Me: "/api/members/me",
    Stats: "/api/members/stats",
    Export: "/api/members/export",
    ById: (id: string) => `/api/members/${id}`,
    Status: (id: string) => `/api/members/${id}/status`,
  },
  Analytics: {
    Dashboard: "/api/analytics/dashboard",
    Plans: "/api/analytics/plans",
  },
  Upload: {
    Presign: "/api/upload/presign",
  },
  Contact: "/api/contact",
  Settings: {
    Base: "/api/settings",
    Admin: "/api/settings/admin",
    ByKey: (key: string) => `/api/settings?key=${key}`,
  },
} as const;
