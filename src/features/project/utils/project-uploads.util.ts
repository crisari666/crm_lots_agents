/** Max size for reel / horizontal project video uploads (bytes) */
export const PROJECT_VIDEO_MAX_BYTES = 16 * 1024 * 1024

/** Max size for project card / gallery image uploads (bytes) */
export const PROJECT_IMAGE_MAX_BYTES = 10 * 1024 * 1024

export function buildProjectAssetUrl(baseUrl: string, fileName: string) {
  if (!fileName) return ""
  if (fileName.startsWith("http")) return fileName
  const base = baseUrl.replace(/\/$/, "")
  return `${base}/projects/${fileName.replace(/^\//, "")}`
}
