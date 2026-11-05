const PANORAMA_MAX_WIDTH = 4096
const PANORAMA_MAX_HEIGHT = 2048
const PANORAMA_START_QUALITY = 0.82
const PANORAMA_MIN_QUALITY = 0.58
const PANORAMA_QUALITY_STEP = 0.08
const PANORAMA_TARGET_BYTES = 4 * 1024 * 1024

/**
 * Shrink a 360 photo in the browser before upload so the request stays small.
 * Returns the original file when the image cannot be decoded.
 */
export async function compressPanoramaFile(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(
      1,
      PANORAMA_MAX_WIDTH / bitmap.width,
      PANORAMA_MAX_HEIGHT / bitmap.height
    )
    const width = evenDimension(bitmap.width * scale)
    const height = evenDimension(bitmap.height * scale)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) {
      bitmap.close()
      return file
    }
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    let quality = PANORAMA_START_QUALITY
    let blob = await canvasToJpeg(canvas, quality)
    while (blob.size > PANORAMA_TARGET_BYTES && quality > PANORAMA_MIN_QUALITY) {
      quality -= PANORAMA_QUALITY_STEP
      blob = await canvasToJpeg(canvas, quality)
    }
    const baseName = file.name.replace(/\.[^.]+$/, "") || "panorama"
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" })
  } catch {
    return file
  }
}

function evenDimension(value: number): number {
  const rounded = Math.max(2, Math.round(value))
  return rounded - (rounded % 2)
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Panorama compression produced an empty image"))
          return
        }
        resolve(blob)
      },
      "image/jpeg",
      quality
    )
  })
}
