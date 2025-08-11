
export const originURL = "https://swayfitness.vercel.app"

export const SITE_URL = "https://thenextschool.vercel.app"

export const DOMAIN = process.env.NODE_ENV === 'development' ?
    'localhost' : process.env.VERCEL_PROJECT_PRODUCTION_URL

export const publicRoutes = [
    "/api(.*)",
    "/sign-in",
    "/sign-up",
    "/forgot-password(.*)",
    "/sso-callback",
    "/contact",
    "/about",
    "/terms-and-conditions",
    "/",
    "/robots.txt",
    "/sitemap.xml",
    "/opengraph-image",
    '/dev(.*)',
    '/posts(.*)'
]

export const PATHS = {
  AdminPlans: "/admin/plans",
  AdminAdmins: "/admin/admins",
  AdminSubscriptions: "/admin/subscriptions",
  AdminDashboard: "/admin/dashboard",
  AdminTransactions: "/admin/transactions",
  AdminProfile: "/admin/profile",
  AdminUsers: "/admin/users",
  AdminSignIn: "/admin/sign-in",

  Contact: "/contact",
  Join: "/join",
  Plans: "/plans",
  MemberInfo: "/member-info",

  DashboardProfile: "/dashboard/profile",
  DashboardBilling: "/dashboard/billing",
  Dashboard: "/dashboard",

  SignIn: "/sign-in",
  Root: "/",
} as const;
