import type { CallAuditAiReviewSummary } from "../services/customers-ms-admin-call-audit.types"

export function formatCallAuditAiCompletedPct(summary: CallAuditAiReviewSummary): string {
  if (summary.totalEligible === 0) {
    return "—"
  }
  const pct = Math.round((summary.aiCompleted / summary.totalEligible) * 100)
  return `${pct}%`
}

export function formatCallAuditTopFailed(summary: CallAuditAiReviewSummary): {
  value: string
  tooltip?: string
} {
  if (summary.topFailedIndicators.length === 0) {
    return { value: "—" }
  }
  const first = summary.topFailedIndicators[0]
  const value = `${first.label} (${first.count})`
  if (summary.topFailedIndicators.length <= 1) {
    return { value }
  }
  const tooltip = summary.topFailedIndicators
    .map((row) => `${row.label}: ${row.count}`)
    .join(" · ")
  return { value, tooltip }
}
