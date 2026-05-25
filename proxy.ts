import { NextRequest, NextResponse } from "next/server"

// ============================================================================
// EXTERNAL ROUTES
// Routes called by third-party services — bypass all checks.
// Add any future inbound webhook paths here.
// ============================================================================

const EXTERNAL_ROUTES = ["/api/webhooks"]

// ============================================================================
// RATE LIMITING
//
// Uses a fixed-window counter stored in a module-level Map.
//
// This works correctly on traditional single-server deployments (VPS, Docker,
// next start). If you move to Vercel or scale horizontally to multiple
// instances, swap this out for @upstash/ratelimit + Redis — each worker
// would otherwise have its own independent counter.
//
// For volumetric DDoS (millions of reqs/s), rate limiting in application code
// is not enough. Put Cloudflare or a similar CDN in front of the server;
// they absorb the traffic before it reaches your process.
// ============================================================================

interface RateLimitRecord {
  hits: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()
let nextSweep = 0

/** Remove expired entries so the Map doesn't grow unbounded. */
function sweep() {
  const now = Date.now()
  if (now < nextSweep) return
  nextSweep = now + 30_000 // run at most once every 30 s
  for (const [key, val] of store) {
    if (now > val.resetAt) store.delete(key)
  }
}

function checkLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  sweep()
  const now    = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { hits: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (record.hits >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.hits++
  return { allowed: true, remaining: limit - record.hits, resetAt: record.resetAt }
}

// ============================================================================
// PER-ROUTE LIMITS
//
// Tighter on auth and payment routes where abuse is most damaging,
// looser on general reads.
// ============================================================================

const ROUTE_LIMITS: Array<{ prefix: string; limit: number; windowMs: number }> = [
  // Sign-in: 10 attempts per minute per IP (brute-force protection)
  { prefix: "/api/auth",                limit: 10, windowMs: 60_000 },
  // Payment verification: 5 per minute (each attempt hits Paystack too)
  { prefix: "/api/transactions/verify", limit: 5,  windowMs: 60_000 },
  // General transaction reads / writes
  { prefix: "/api/transactions",        limit: 20, windowMs: 60_000 },
  // Member data
  { prefix: "/api/members",             limit: 30, windowMs: 60_000 },
  // Settings (public read)
  { prefix: "/api/settings",            limit: 30, windowMs: 60_000 },
]

const GLOBAL_LIMIT  = 60   // req / minute for any other route
const GLOBAL_WINDOW = 60_000

function getLimits(pathname: string) {
  for (const rule of ROUTE_LIMITS) {
    if (pathname.startsWith(rule.prefix)) {
      return { limit: rule.limit, windowMs: rule.windowMs }
    }
  }
  return { limit: GLOBAL_LIMIT, windowMs: GLOBAL_WINDOW }
}

// ============================================================================
// HELPERS
// ============================================================================

function getClientIP(req: NextRequest): string {
  // x-forwarded-for is set by proxies and Vercel's edge network.
  // x-real-ip is set by nginx. Fall back to "unknown" if neither is present.
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

/**
 * Returns true when the Referer header is present and its host matches
 * the server's own Host header.
 *
 * Browsers always attach a Referer to fetch/XHR requests initiated from a page.
 * curl, Postman, and external scripts omit it by default.
 *
 * Limitations:
 *  - Referer can be spoofed by any HTTP client.
 *  - Some browsers suppress it under strict Referrer-Policy settings.
 *  - Server-to-server calls (e.g. Paystack webhook) don't send it — those
 *    are handled by the EXTERNAL_ROUTES exemption above.
 *
 * In practice this blocks the vast majority of unsophisticated external
 * callers with no cost and no moving parts.
 */
function hasValidReferer(req: NextRequest): boolean {
  const host    = req.headers.get("host")
  const referer = req.headers.get("referer")
  if (!host || !referer) return false
  try {
    return new URL(referer).host === host
  } catch {
    return false
  }
}

function jsonResponse(body: object, status: number, extra?: HeadersInit) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  })
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only police API routes — pages and static assets are unaffected
  if (!pathname.startsWith("/api")) return NextResponse.next()

  // Pass through routes called by external services
  if (EXTERNAL_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // 1. Rate limiting

  const ip               = getClientIP(request)
  const { limit, windowMs } = getLimits(pathname)
  // Key per IP + route prefix so limits are independent per endpoint
  const rl               = checkLimit(`${ip}||${pathname}`, limit, windowMs)

  const rlHeaders = {
    "X-RateLimit-Limit":     String(limit),
    "X-RateLimit-Remaining": String(rl.remaining),
    "X-RateLimit-Reset":     String(Math.ceil(rl.resetAt / 1000)),
  }

  if (!rl.allowed) {
    const retryAfter = String(Math.ceil((rl.resetAt - Date.now()) / 1000))
    return jsonResponse(
      { success: false, message: "Too many requests. Please try again shortly." },
      429,
      { ...rlHeaders, "Retry-After": retryAfter }
    )
  }

  // 2. Referer check

  if (!hasValidReferer(request)) {
    return jsonResponse(
      { success: false, message: "Unauthorized" },
      401,
      rlHeaders
    )
  }

  // Pass through — attach rate limit headers for observability

  const response = NextResponse.next()
  for (const [k, v] of Object.entries(rlHeaders)) {
    response.headers.set(k, v)
  }
  return response
}

export const config = {
  matcher: "/api/:path*",
}
