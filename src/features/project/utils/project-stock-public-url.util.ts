export function getAgentAppBaseUrl(): string {
  const fromAgent = (import.meta.env.VITE_AGENT_BASE_URL as string | undefined)?.trim() ?? ""
  if (fromAgent !== "") {
    return fromAgent.replace(/\/$/, "")
  }
  const fromSignup = (import.meta.env.VITE_SIGNUP_PUBLIC_BASE_URL as string | undefined)?.trim() ?? ""
  return fromSignup.replace(/\/$/, "")
}

export function buildProjectStockPublicUrl(projectId: string): string {
  const base = getAgentAppBaseUrl()
  if (base === "" || projectId.trim() === "") {
    return ""
  }
  return `${base}/stock/${encodeURIComponent(projectId)}`
}
