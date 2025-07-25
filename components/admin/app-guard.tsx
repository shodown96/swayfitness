
"use client"
import { useStoreHydration } from '@/hooks/store-hydration'
import { useAuthStore } from '@/lib/stores/authStore'
import { PropsWithChildren } from 'react'

export default function AppGuard({ children }: PropsWithChildren) {
    const hydrate = useAuthStore.persist?.rehydrate;
    const alreadyHydrated = useAuthStore.persist?.hasHydrated();
    const { hasHydrated } = useStoreHydration({ hydrate, alreadyHydrated });

    if (!hasHydrated) return null;
    return children
}