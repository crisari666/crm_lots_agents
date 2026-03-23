export function buildProjectAssetUrl(baseUrl: string, fileName: string) {
  if (!fileName) return ""
  if (fileName.startsWith("http")) return fileName
  const base = baseUrl.replace(/\/$/, "")
  return `${base}/projects/${fileName.replace(/^\//, "")}`
}
