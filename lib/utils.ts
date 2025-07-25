import { type ClassValue, clsx } from "clsx"
import { differenceInCalendarDays, isSameDay, parseISO } from "date-fns"
import { twMerge } from "tailwind-merge"

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
  const targetDate = typeof nextBillingDate === "string" ? parseISO(nextBillingDate) : nextBillingDate
  const today = new Date()
  return differenceInCalendarDays(targetDate, today)
}