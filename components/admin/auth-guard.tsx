"use client"
import { mainClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/constants/api'
import { PATHS } from '@/lib/constants/paths'
import { isPublicRoute } from '@/lib/paths'
import { useAuthStore } from '@/lib/stores/authStore'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import TextLoader from '../custom/TextLoader'

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser } = useAuthStore()
    const isPublic = isPublicRoute(pathname)

    useEffect(() => {
        const fetchUser = async () => {
            const result = await mainClient.get(API_ENDPOINTS.Members.Me);
            if (result.success && result.data) {
                console.log(result)
                setUser(result.data.user)
            } else {

                if (!isPublic) router.replace(PATHS.SignIn)
            }
        }
        if (!user) {
            fetchUser()
        }
    }, [user])

    console.log(user)

    if (!user && !isPublic) return <></>
    if (!user) return <></>
    return (

        <TextLoader loading={!user}>
            {children}
        </TextLoader>
    )
}