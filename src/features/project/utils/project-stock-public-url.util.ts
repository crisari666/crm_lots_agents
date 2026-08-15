export function getAgentAppBaseUrl(): string {
  const fromAgent = (import.meta.env.VITE_AGENT_BASE_URL as string | undefined)?.trim() ?? ""
  if (fromAgent !== "") {
    return fromAgent.replace(/\/$/, "")
  }
  const fromSignup = (import.meta.env.VITE_SIGNUP_PUBLIC_BASE_URL as string | undefined)?.trim() ?? ""
  return fromSignup.replace(/\/$/, "")
}

export type ProjectStockPublicView = "map" | "grid" | "columns" | "glance"

export function buildProjectStockPublicUrl(
  projectId: string,
  view?: ProjectStockPublicView | ""
): string {
  const base = getAgentAppBaseUrl()
  if (base === "" || projectId.trim() === "") {
    return ""
  }
  const path = `${base}/stock/${encodeURIComponent(projectId)}`
  if (!view) {
    return path
  }
  return `${path}#${view}`
}
