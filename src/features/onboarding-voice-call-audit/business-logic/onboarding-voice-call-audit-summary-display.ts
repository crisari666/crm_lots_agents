import type { OnboardingVoiceCallAuditAiReviewSummary } from "../types/onboarding-voice-call-audit.types"

export function formatOnboardingVoiceAuditCompletedPct(
  summary: OnboardingVoiceCallAuditAiReviewSummary
): string {
  if (summary.totalEligible === 0) {
    return "—"
  }
  const pct = Math.round((summary.aiCompleted / summary.totalEligible) * 100)
  return `${pct}%`
}

export function formatOnboardingVoiceAuditTopFailed(
  summary: OnboardingVoiceCallAuditAiReviewSummary
): { value: string; tooltip?: string } {
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

/** Month bounds in Bogota offset for backfill API. */
export function monthRangeIsoFromYYYYMM(month: string): { from: string; to: string } {
  const [yearStr, monthStr] = month.split("-")
  const year = Number(yearStr)
  const mon = Number(monthStr)
  const lastDay = new Date(year, mon, 0).getDate()
  const mm = monthStr.padStart(2, "0")
  const from = `${yearStr}-${mm}-01T00:00:00.000-05:00`
  const to = `${yearStr}-${mm}-${String(lastDay).padStart(2, "0")}T23:59:59.999-05:00`
  return { from, to }
}
