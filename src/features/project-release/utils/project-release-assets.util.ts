export function buildProjectReleaseAssetUrl(baseUrl: string, fileName: string) {
  if (!fileName) return ""
  if (fileName.startsWith("http")) return fileName
  const base = baseUrl.replace(/\/$/, "")
  return `${base}/project-releases/${fileName.replace(/^\//, "")}`
}
