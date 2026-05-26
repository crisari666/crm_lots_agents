import type {
  ListOnboardingVoiceCallAuditAiReviewParams,
  OnboardingVoiceCallAuditAiReviewFilters,
} from "../types/onboarding-voice-call-audit.types"

export function buildOnboardingVoiceCallAuditAiReviewParams(
  filters: OnboardingVoiceCallAuditAiReviewFilters
): ListOnboardingVoiceCallAuditAiReviewParams {
  return {
    month: filters.month,
    skip: filters.page * filters.limit,
    limit: filters.limit,
    ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
    ...(filters.excludeVoicemail ? {} : { excludeVoicemail: false }),
    ...(filters.excludeWithoutTranscript ? {} : { excludeWithoutTranscript: false }),
  }
}
