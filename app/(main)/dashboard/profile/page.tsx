"use client"

import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { useAuthStore } from "@/lib/stores/authStore"
import { formatDateForInput } from "@/lib/utils"
import { ProfileUpdateParamsType } from "@/lib/validations"
import { useState } from "react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (values: ProfileUpdateParamsType) => {
    setIsLoading(true)
    try {
      const result = await mainClient.put(API_ENDPOINTS.Members.Me, values)
      if (result.success && result.data) {
        toast.success("Profile updated successfully!")
        setUser(result.data.user)
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const initialValues: ProfileUpdateParamsType = {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    dob: user.dob ? formatDateForInput(new Date(user.dob)) : "",
    gender: user.gender || "male",
    avatarUrl: user.avatarUrl || "",
    emergencyContactName: user.emergencyContactName || "",
    emergencyContactPhone: user.emergencyContactPhone || "",
    emergencyContactRelationship: user.emergencyContactRelationship || "",
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your personal information</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="">
          <ProfileUpdateForm
            initialValues={initialValues}
            onFormSubmit={handleSubmit}
            isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
