import { PlanInterval } from "@prisma/client"

export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  interval: 'month' | 'year'
  originalPrice?: number
  popular?: boolean
  features: string[]
}



export const REGISTRATION_FEE = Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getNextPaymentDate(interval: PlanInterval): string {
  const date = new Date()
  if (interval === 'monthly') {
    date.setMonth(date.getMonth() + 1)
  } else {
    date.setFullYear(date.getFullYear() + 1)
  }
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
