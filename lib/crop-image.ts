import type { Area } from "react-easy-crop"

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", reject)
    img.setAttribute("crossOrigin", "anonymous")
    img.src = url
  })
}

/**
 * Returns a cropped Blob (JPEG) from an image URL and a pixel-accurate crop area.
 * Works entirely client-side via an off-screen canvas.
 */
export async function getCroppedBlob(imageSrc: string, cropArea: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = cropArea.width
  canvas.height = cropArea.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(
    image,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, cropArea.width, cropArea.height,
  )
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      "image/jpeg",
      0.92,
    )
  })
}
