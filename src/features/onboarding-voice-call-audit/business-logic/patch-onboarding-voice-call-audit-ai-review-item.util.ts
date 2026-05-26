import type {
  OnboardingVoiceCallAuditAiReviewItem,
  OnboardingVoiceCallAuditAiReviewListResponse,
  OnboardingVoiceCallAuditRecord,
} from "../types/onboarding-voice-call-audit.types"
import { buildOnboardingVoiceCallAuditAiReviewSummary } from "./build-onboarding-voice-call-audit-ai-review-summary.util"

function mapRecordStatusToAiStatus(
  status: OnboardingVoiceCallAuditRecord["status"]
): OnboardingVoiceCallAuditAiReviewItem["aiStatus"] {
  if (status === "pending") {
    return "pending"
  }
  if (status === "failed") {
    return "failed"
  }
  return "completed"
}

/** Updates one row and recomputes month KPIs after POST analyze succeeds. */
export function patchOnboardingVoiceCallAuditAiReviewItem(
  list: OnboardingVoiceCallAuditAiReviewListResponse,
  record: OnboardingVoiceCallAuditRecord
): OnboardingVoiceCallAuditAiReviewListResponse {
  const items = list.items.map((item) => {
    if (item.flowId !== record.flowId) {
      return item
    }
    return {
      ...item,
      isVoicemailFlow: item.isVoicemailFlow || record.isVoicemail,
      aiStatus: mapRecordStatusToAiStatus(record.status),
      ai: record,
    }
  })
  return {
    ...list,
    items,
    summary: buildOnboardingVoiceCallAuditAiReviewSummary(items),
  }
}
