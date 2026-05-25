"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCroppedBlob } from "@/lib/crop-image"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { Camera, Loader2 } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"

interface AvatarUploadProps {
  // S3 URL stored in form state
  value: string
  onChange: (s3Url: string) => void
  // Name used for initials fallback
  name?: string
  // Size of the avatar button
  size?: "md" | "lg"
  label?: string
}

export default function AvatarUpload({
  value,
  onChange,
  name = "",
  size = "md",
  label,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local blob URL for immediate display (independent of S3 public-read settings)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Cropper state
  const [cropSrc, setCropSrc] = useState<string>("")
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const avatarSize = size === "lg" ? "h-24 w-24" : "h-20 w-20"
  const displaySrc = previewUrl || value || undefined

  // Called when user picks a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Revoke any previous object URL
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    const objectUrl = URL.createObjectURL(file)
    setCropSrc(objectUrl)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCropOpen(true)
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !cropSrc) return
    setError("")
    setUploading(true)
    setCropOpen(false)

    try {
      // 1. Generate cropped blob from canvas
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels)

      // 2. Show local preview immediately — no S3 round-trip needed for display
      const localPreview = URL.createObjectURL(blob)
      setPreviewUrl(localPreview)

      // 3. Get presigned upload URL (use a generic filename with the correct extension)
      const fileName = `avatar_${Date.now()}.jpg`
      const res = await fetch(
        `${API_ENDPOINTS.Upload.Presign}?type=${encodeURIComponent("image/jpeg")}&filename=${encodeURIComponent(fileName)}`
      )
      const json = await res.json()
      if (!json.success || !json.data?.uploadUrl) throw new Error(json.message || "Failed to get upload URL")

      const { uploadUrl, fileUrl } = json.data as { uploadUrl: string; fileUrl: string }

      // 4. PUT the cropped blob directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/jpeg" },
      })
      if (!uploadRes.ok) throw new Error("Upload to storage failed")

      // 5. Persist the S3 URL in form state
      onChange(fileUrl)
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.")
      setPreviewUrl("")
    } finally {
      setUploading(false)
      URL.revokeObjectURL(cropSrc)
      setCropSrc("")
    }
  }

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl("")
    }
    onChange("")
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="relative group focus:outline-none"
        aria-label="Upload profile photo"
      >
        <Avatar className={`${avatarSize} ring-2 ring-offset-2 ring-orange-200 group-hover:ring-orange-400 transition-all`}>
          <AvatarImage src={displaySrc} alt={name} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xl">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : initials || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1.5 shadow group-hover:bg-orange-600 transition-colors">
          <Camera className="w-3.5 h-3.5" />
        </span>
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          {uploading ? "Uploading…" : (label ?? "Click to add a profile photo (optional)")}
        </p>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        {(previewUrl || value) && !uploading && (
          <button type="button" onClick={handleRemove} className="text-xs text-red-500 hover:underline mt-0.5">
            Remove photo
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Crop modal */}
      <Dialog open={cropOpen} onOpenChange={(open) => { if (!open) setCropOpen(false) }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Crop your photo</DialogTitle>
          </DialogHeader>

          <div className="relative w-full" style={{ height: 300 }}>
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom slider */}
          <div className="px-6 pt-4 pb-2">
            <label className="text-xs text-gray-500 mb-1 block">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <DialogFooter className="px-6 pb-6 pt-2 gap-2">
            <Button variant="outline" onClick={() => setCropOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleApplyCrop}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
