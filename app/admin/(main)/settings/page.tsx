"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AppSetting, SettingsService } from "@/lib/services/settings.service"
import { useAuthStore } from "@/lib/stores/authStore"
import { AccountRole } from "@prisma/client"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Known settings with friendly metadata.
// Add new entries here as the app grows — unknown DB keys will appear as raw editors at the bottom.
const SETTINGS_SCHEMA: Array<{
  key: string
  label: string
  description: string
  type: "number" | "string"
  prefix?: string
  suffix?: string
  min?: number
  superadminOnly: boolean
}> = [
  {
    key: "registration_fee",
    label: "Registration Fee",
    description:
      "One-time fee charged to all new members at sign-up, in addition to their first subscription payment.",
    type: "number",
    prefix: "₦",
    min: 0,
    superadminOnly: true,
  },
]

interface EditState {
  [key: string]: string
}

interface SavingState {
  [key: string]: boolean
}

export default function AdminSettingsPage() {
  const { user } = useAuthStore()
  const isSuperAdmin = user?.role === AccountRole.superadmin

  const [settings, setSettings] = useState<AppSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [editValues, setEditValues] = useState<EditState>({})
  const [saving, setSaving] = useState<SavingState>({})

  useEffect(() => {
    SettingsService.getAllForAdmin()
      .then((res) => {
        if (res.success && res.data) {
          const data = res.data
          setSettings(data)
          // Seed edit values from current DB values
          const initial: EditState = {}
          for (const s of data) initial[s.key] = s.value
          setEditValues(initial)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (key: string, type: "number" | "string") => {
    const raw = editValues[key]
    if (raw === undefined) return

    const value = type === "number" ? Number(raw) : raw

    if (type === "number" && isNaN(Number(raw))) {
      toast.error("Please enter a valid number")
      return
    }

    setSaving((s) => ({ ...s, [key]: true }))
    try {
      const res = await SettingsService.adminUpdate(key, value, type)
      if (res.success && res.data) {
        setSettings((prev) =>
          prev.map((s) => (s.key === key ? res.data! : s))
        )
        toast.success("Setting saved")
      } else {
        toast.error(res.message || "Failed to save setting")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setSaving((s) => ({ ...s, [key]: false }))
    }
  }

  // Split into known and unknown settings
  const knownKeys = new Set(SETTINGS_SCHEMA.map((s) => s.key))
  const unknownSettings = settings.filter((s) => !knownKeys.has(s.key))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          {isSuperAdmin
            ? "Manage gym-wide configuration. Changes take effect immediately."
            : "View gym-wide configuration. Only super admins can make changes."}
        </p>
      </div>

      {/* Membership settings */}
      <Card>
        <CardHeader>
          <CardTitle>Membership</CardTitle>
          <CardDescription>Fees and policies applied when members join or renew.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full max-w-xs" />
                  <Skeleton className="h-3 w-64" />
                </div>
              ))}
            </div>
          ) : (
            SETTINGS_SCHEMA.map((schema) => {
              const dbSetting = settings.find((s) => s.key === schema.key)
              const currentValue = editValues[schema.key] ?? dbSetting?.value ?? ""
              const isDirty = currentValue !== (dbSetting?.value ?? "")
              const isSaving = saving[schema.key] ?? false
              const canEdit = isSuperAdmin && !schema.superadminOnly
                ? true
                : isSuperAdmin

              return (
                <div key={schema.key} className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    {schema.label}
                    {schema.superadminOnly && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        super admin only
                      </span>
                    )}
                  </Label>
                  <div className="flex items-center gap-3 max-w-xs">
                    {schema.prefix && (
                      <span className="text-sm text-gray-500 shrink-0">{schema.prefix}</span>
                    )}
                    <Input
                      type={schema.type === "number" ? "number" : "text"}
                      min={schema.min}
                      value={currentValue}
                      disabled={!canEdit || isSaving}
                      onChange={(e) =>
                        setEditValues((prev) => ({ ...prev, [schema.key]: e.target.value }))
                      }
                      className="flex-1"
                    />
                    {schema.suffix && (
                      <span className="text-sm text-gray-500 shrink-0">{schema.suffix}</span>
                    )}
                    {canEdit && (
                      <Button
                        size="sm"
                        disabled={!isDirty || isSaving}
                        onClick={() => handleSave(schema.key, schema.type)}
                        className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        {isSaving ? "Saving…" : "Save"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{schema.description}</p>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Raw editor for any DB settings not in the schema */}
      {!loading && unknownSettings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Other Settings</CardTitle>
            <CardDescription>Additional configuration values stored in the database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {unknownSettings.map((s) => {
              const currentValue = editValues[s.key] ?? s.value
              const isDirty = currentValue !== s.value
              const isSaving = saving[s.key] ?? false

              return (
                <div key={s.key} className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700 font-mono">{s.key}</Label>
                  <div className="flex items-center gap-3 max-w-sm">
                    <Input
                      value={currentValue}
                      disabled={!isSuperAdmin || isSaving}
                      onChange={(e) =>
                        setEditValues((prev) => ({ ...prev, [s.key]: e.target.value }))
                      }
                      className="flex-1"
                    />
                    {isSuperAdmin && (
                      <Button
                        size="sm"
                        disabled={!isDirty || isSaving}
                        onClick={() => handleSave(s.key, s.type as "number" | "string")}
                        className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        {isSaving ? "Saving…" : "Save"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">type: {s.type}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
