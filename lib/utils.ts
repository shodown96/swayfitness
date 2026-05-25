import { type ClassValue, clsx } from "clsx"
import { differenceInCalendarDays, isSameDay, parseISO } from "date-fns"
import { twMerge } from "tailwind-merge"
import { APP_SEARCH_RATE } from "./constants/app"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatString = (template: string, ...args: string[]): string => {
  return template.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== "undefined" ? args[number] : match
  })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const generateMemberId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `GYM${timestamp}${random}`;
}


export function isToday(dateString: string): boolean {
  const date = parseISO(dateString)
  const today = new Date()
  return isSameDay(date, today)
}

export function daysUntilNextBilling(nextBillingDate: string | Date): number {
  const target = new Date(nextBillingDate)
  const today = new Date()

  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  const diffInMs = target.getTime() - today.getTime()
  const diffInDays = Math.floor(diffInMs / msPerDay)
  return Math.abs(diffInDays)
}

export function getDaysSinceJoining(joinDate: string | Date): number {
  const join = new Date(joinDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - join.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Returns the effective next billing date for a subscription.
// Uses nextBillingDate if available, otherwise estimates from startDate + plan interval.
export function getEffectiveNextBillingDate(
  subscription: {
    nextBillingDate?: Date | string | null
    startDate: Date | string
    plan: { interval: string }
  } | null | undefined
): Date | null {
  if (!subscription?.startDate) return null
  if (subscription.nextBillingDate) return new Date(subscription.nextBillingDate)

  const next = new Date(subscription.startDate)
  switch (subscription.plan.interval) {
    case "monthly":    next.setMonth(next.getMonth() + 1); break
    case "annually":   next.setFullYear(next.getFullYear() + 1); break
    case "weekly":     next.setDate(next.getDate() + 7); break
    case "daily":      next.setDate(next.getDate() + 1); break
    case "quarterly":  next.setMonth(next.getMonth() + 3); break
    case "biannually": next.setMonth(next.getMonth() + 6); break
    case "hourly":     next.setHours(next.getHours() + 1); break
    default: return null
  }
  return next
}

export const delayDebounceFn = (callBack: () => void) =>
  setTimeout(callBack, APP_SEARCH_RATE);

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'expired':
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'suspended':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const formatDateTimeForInput = (date: string | Date | null | undefined): string => {
  if (!date) return ""

  const d = new Date(date)
  if (isNaN(d.getTime())) return ""

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return ""

  const d = new Date(date)
  if (isNaN(d.getTime())) return ""

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}