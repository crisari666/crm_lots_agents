/**
 * Builds a public URL for an experience asset / library file under RAG uploads.
 */
export function buildExperienceAssetUrl(fileName: string): string {
  if (!fileName) return ""
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName
  }
  const base = (
    import.meta.env.VITE_URL_RAG_AGENT_UPLOADS as string | undefined
  )
    ?.trim()
    .replace(/\/$/, "")
  if (!base) return ""
  return `${base}/projects/${fileName.replace(/^\//, "")}`
}

/** Stable Mapbox model id for a shared GLB filename. */
export function toExperienceModelId(fileName: string): string {
  return `exp_${fileName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 96)}`
}
