import type {
  OnboardingVoiceCallAuditAiReviewItem,
  OnboardingVoiceCallAuditAiReviewSummary,
} from "../types/onboarding-voice-call-audit.types"
import { buildOnboardingVoiceCallAuditIndicatorsSummary } from "./build-onboarding-voice-call-audit-indicators-summary.util"

const TOP_FAILED_LIMIT = 3

export function buildOnboardingVoiceCallAuditAiReviewSummary(
  items: readonly OnboardingVoiceCallAuditAiReviewItem[]
): OnboardingVoiceCallAuditAiReviewSummary {
  const eligibleItems = items.filter((item) => !item.isVoicemailFlow)
  let aiCompleted = 0
  let aiPending = 0
  let aiFailed = 0
  let aiNone = 0
  let interestSum = 0
  let interestCount = 0
  const failedCounts = new Map<string, number>()
  for (const item of eligibleItems) {
    switch (item.aiStatus) {
      case "completed":
        aiCompleted += 1
        if (item.ai !== null && item.ai.status === "completed" && !item.ai.isVoicemail) {
          interestSum += item.ai.interestScore
          interestCount += 1
          const summary = buildOnboardingVoiceCallAuditIndicatorsSummary(
            item.ai.indicators
          )
          for (const label of summary.failedLabels) {
            failedCounts.set(label, (failedCounts.get(label) ?? 0) + 1)
          }
        }
        break
      case "pending":
        aiPending += 1
        break
      case "failed":
        aiFailed += 1
        break
      default:
        aiNone += 1
        break
    }
  }
  const topFailedIndicators = Array.from(failedCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, TOP_FAILED_LIMIT)
  return {
    dateBasis: "transcriptEventAt",
    totalEligible: eligibleItems.length,
    aiCompleted,
    aiPending,
    aiFailed,
    aiNone,
    avgInterestScore:
      interestCount > 0 ? Math.round((interestSum / interestCount) * 10) / 10 : null,
    topFailedIndicators,
  }
}
