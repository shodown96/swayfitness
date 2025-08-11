"use client"

import { Input } from "@/components/custom/Input"; // Custom Input component
import { InputPassword } from "@/components/custom/InputPassword";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { AdminsService } from "@/lib/services/admins.service";
import { useAuthStore } from "@/lib/stores/authStore";
import { AdminProfileParamsSchema, AdminProfileParamsType, PasswordParamsSchema, PasswordParamsType } from "@/lib/validations";
import { AccountRole } from "@prisma/client";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { Activity, Bell, Lock, Mail, Phone, Save, Shield, User } from 'lucide-react';
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    memberUpdates: true,
    paymentAlerts: true,
    systemAlerts: false
  })

  // Profile form with Formik + Zod
  const profileForm = useFormik<AdminProfileParamsType>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validationSchema: AdminProfileParamsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Implement actual API call here
        const data = await AdminsService.updateMe(values)
        if (data.success) {
          setIsEditing(false)
          toast.success("Profile updated successfully!")
        } else {
          toast.error(data.message || ERROR_MESSAGES.BadRequestError)
        }
      } catch (error) {
        toast.error("Error updating profile")
      } finally {
        setSubmitting(false)
      }
    }
  })

  // Password change form with Formik + Zod
  const passwordForm = useFormik<PasswordParamsType>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: PasswordParamsSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Implement actual API call here
        const data = await AdminsService.updateMe({
          currentPassword: values.currentPassword,
          password: values.newPassword
        })
        if (data.success) {
          setIsEditing(false)
          toast.success("Password updated successfully!")
        } else {
          toast.error(data.message || ERROR_MESSAGES.BadRequestError)
        }

        resetForm()
        toast.success("Password changed successfully!")
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message)
        } else {
          toast.error("Error changing password")
        }
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleCancelEdit = () => {
    setIsEditing(false)
    profileForm.resetForm({
      values: {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      }
    })
  }

  const recentActivities = [
    { action: 'Logged in', time: '2 hours ago', ip: '192.168.1.1' },
    { action: 'Updated member profile', time: '4 hours ago', ip: '192.168.1.1' },
    { action: 'Processed refund', time: '1 day ago', ip: '192.168.1.1' },
    { action: 'Exported transaction report', time: '2 days ago', ip: '192.168.1.1' },
    { action: 'Added new admin', time: '3 days ago', ip: '192.168.1.1' },
  ]

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  type="button"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={profileForm.handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    name="name"
                    onBlur={profileForm.handleBlur}
                    onChange={profileForm.handleChange}
                    placeholder="Enter your full name"
                    value={profileForm.values.name}
                    error={profileForm.errors.name}
                    touched={profileForm.touched.name}
                    leftIcon={User}
                    label="Full Name"
                    disabled={!isEditing}
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    onBlur={profileForm.handleBlur}
                    onChange={profileForm.handleChange}
                    placeholder="Enter your email"
                    value={profileForm.values.email}
                    error={profileForm.errors.email}
                    touched={profileForm.touched.email}
                    leftIcon={Mail}
                    label="Email Address"
                    disabled={!isEditing}
                  />
                  <Input
                    id="phone"
                    name="phone"
                    onBlur={profileForm.handleBlur}
                    onChange={profileForm.handleChange}
                    placeholder="Enter your phone number"
                    value={profileForm.values.phone}
                    error={profileForm.errors.phone}
                    touched={profileForm.touched.phone}
                    leftIcon={Phone}
                    label="Phone Number"
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1">
                      <Badge className={user.role === AccountRole.superadmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Account Created</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!profileForm.isValid || profileForm.isSubmitting}>
                      {profileForm.isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
                <InputPassword
                  id="currentPassword"
                  name="currentPassword"
                  onBlur={passwordForm.handleBlur}
                  onChange={passwordForm.handleChange}
                  placeholder="Enter current password"
                  value={passwordForm.values.currentPassword}
                  error={passwordForm.errors.currentPassword}
                  touched={passwordForm.touched.currentPassword}
                  leftIcon={Lock}
                  label="Current Password"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <InputPassword
                    id="newPassword"
                    name="newPassword"
                    onBlur={passwordForm.handleBlur}
                    onChange={passwordForm.handleChange}
                    placeholder="Enter new password"
                    value={passwordForm.values.newPassword}
                    error={passwordForm.errors.newPassword}
                    touched={passwordForm.touched.newPassword}
                    leftIcon={Lock}
                    label="New Password"
                  />

                  <InputPassword
                    id="confirmPassword"
                    name="confirmPassword"
                    onBlur={passwordForm.handleBlur}
                    onChange={passwordForm.handleChange}
                    placeholder="Confirm new password"
                    value={passwordForm.values.confirmPassword}
                    error={passwordForm.errors.confirmPassword}
                    touched={passwordForm.touched.confirmPassword}
                    leftIcon={Lock}
                    label="Confirm New Password"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!passwordForm.isValid || passwordForm.isSubmitting}>
                    {passwordForm.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about system activities</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Member Updates</p>
                  <p className="text-sm text-gray-500">Get notified when members join or update profiles</p>
                </div>
                <Switch
                  checked={notifications.memberUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, memberUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Alerts</p>
                  <p className="text-sm text-gray-500">Receive alerts for failed payments and refunds</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-gray-500">Critical system notifications and maintenance updates</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        {/* <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <p className="text-xs text-gray-400">IP: {activity.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}