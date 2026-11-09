function isBrowserReachableHttpUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return false
  }
  try {
    const host = new URL(trimmed).hostname.toLowerCase()
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return false
    }
  } catch {
    return false
  }
  return true
}

/**
 * Prefers the absolute URL saved on the resource or placement.
 * Falls back to building one from the file name for older rows
 * and for localhost URLs that browsers cannot load remotely.
 */
export function resolveExperienceAssetUrl(asset: {
  url?: string
  fileName: string
}): string {
  const stored = asset.url?.trim() ?? ""
  if (isBrowserReachableHttpUrl(stored)) {
    return stored
  }
  return buildExperienceAssetUrl(asset.fileName)
}

/**
 * Builds a public URL for an experience asset / library file under RAG uploads.
 */
export function buildExperienceAssetUrl(fileName: string): string {
  if (!fileName) return ""
  if (isBrowserReachableHttpUrl(fileName)) {
    return fileName
  }
  const bareName = fileName.includes("://")
    ? fileName.slice(fileName.lastIndexOf("/") + 1)
    : fileName.replace(/^\//, "")
  if (!bareName) return ""
  const base = (
    import.meta.env.VITE_URL_RAG_AGENT_UPLOADS as string | undefined
  )
    ?.trim()
    .replace(/\/$/, "")
  if (!base) return ""
  return `${base}/projects/${bareName}`
}

/** Stable Mapbox model id for a shared GLB filename. */
export function toExperienceModelId(fileName: string): string {
  return `exp_${fileName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 96)}`
}
