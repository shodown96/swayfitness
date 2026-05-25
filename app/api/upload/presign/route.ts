import { constructResponse } from "@/lib/response"
import { S3Service } from "@/lib/services/s3.service"

import { type NextRequest } from "next/server"

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

// Public endpoint — called before the user has an account (registration flow)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get("type") ?? ""
    const rawName = searchParams.get("filename") ?? ""

    if (!ALLOWED_IMAGE_TYPES[contentType]) {
      return constructResponse({ statusCode: 400, message: "Only JPEG, PNG and WebP images are allowed." })
    }

    if (!rawName) {
      return constructResponse({ statusCode: 400, message: "filename is required." })
    }

    // Sanitise: strip path separators, collapse spaces to underscores
    const fileName = rawName.replace(/[/\\]/g, "").replace(/\s+/g, "_")
    const folder = "avatars"

    const uploadUrl = await S3Service.getPreSignedUrl({ fileName, folder, expiresIn: 300 })
    const fileUrl = S3Service.getFileUrl(`${folder}/${fileName}`)

    return constructResponse({ statusCode: 200, data: { uploadUrl, fileUrl } })
  } catch (error) {
    console.error("[upload/presign]", error)
    return constructResponse({ statusCode: 500, message: "Could not generate upload URL." })
  }
}
