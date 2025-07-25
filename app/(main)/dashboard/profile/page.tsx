"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm"
import { useAuthStore } from "@/lib/stores/authStore"
import { ArrowLeft, Upload } from "lucide-react"
import { ProfileUpdateParamsType } from "@/lib/validations"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")


  const handleSubmit = async (values: ProfileUpdateParamsType) => {
    setIsLoading(true)
    try {
      const result = await mainClient.put(API_ENDPOINTS.Members.Me, values)
      if (result.success && result.data) {
        setSaveMessage("Profile updated successfully!")
        setUser(result.data.user)
      }

      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    } catch (error) {
      setSaveMessage("Error updating profile. Please try again.")
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
    dob: user.dob ? (new Date(user.dob)).toISOString() : "",
    gender: user.gender || "male",
    emergencyContactName: user.emergencyContactName || "",
    emergencyContactPhone: user.emergencyContactPhone || "",
    emergencyContactRelationship: user.emergencyContactRelationship || "",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Edit Profile</h1>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${saveMessage.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
          >
            {saveMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage  />
                <AvatarFallback className="bg-orange-500 text-white text-3xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileUpdateForm
                  initialValues={initialValues}
                  onFormSubmit={handleSubmit}
                  isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
