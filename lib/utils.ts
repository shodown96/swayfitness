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
  // const targetDate = typeof nextBillingDate === "string" ? parseISO(nextBillingDate) : nextBillingDate
  // const today = new Date()
  // return differenceInCalendarDays(targetDate, today)
  const target = new Date(nextBillingDate)
  console.log(target)
  const today = new Date()

  // Normalize both dates to midnight (ignore time)
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  const diffInMs = target.getTime() - today.getTime()
  const diffInDays = Math.floor(diffInMs / msPerDay)
  return Math.abs(diffInDays)
}

export const delayDebounceFn = (callBack: () => void) =>
  setTimeout(callBack, APP_SEARCH_RATE);