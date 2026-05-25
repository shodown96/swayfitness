import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton placeholder for a single plan card while plans are loading. */
export function PlanCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="text-center pb-4">
        {/* Plan name */}
        <Skeleton className="h-7 w-32 mx-auto mb-3" />
        {/* Price */}
        <Skeleton className="h-10 w-24 mx-auto mb-2" />
        {/* Period label */}
        <Skeleton className="h-4 w-16 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {/* Feature rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 flex-1" style={{ width: `${60 + (i % 3) * 15}%` }} />
          </div>
        ))}
        {/* CTA button */}
        <Skeleton className="h-10 w-full mt-6 rounded-md" />
      </CardContent>
    </Card>
  )
}

/** Three skeleton cards in the same grid used by /plans and /join. */
export function PlansGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </div>
  )
}
