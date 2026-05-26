import Api from "../../../app/axios"
import type {
  ListOnboardingVoiceCallAuditAiReviewParams,
  OnboardingVoiceCallAuditAiReviewListResponse,
  OnboardingVoiceCallAuditBackfillResponse,
  OnboardingVoiceCallAuditConfigResponse,
  OnboardingVoiceCallAuditRecord,
} from "../types/onboarding-voice-call-audit.types"

export async function getOnboardingVoiceCallAuditConfig(): Promise<OnboardingVoiceCallAuditConfigResponse> {
  const api = Api.getInstance()
  const response = (await api.get({
    path: "onboarding-voice-call-audit/config",
  })) as OnboardingVoiceCallAuditConfigResponse | undefined
  if (response === undefined) {
    throw new Error("No se pudo cargar la configuración de auditoría de voz onboarding")
  }
  return response
}

export async function getOnboardingVoiceCallAuditAiReview(
  params: ListOnboardingVoiceCallAuditAiReviewParams
): Promise<OnboardingVoiceCallAuditAiReviewListResponse> {
  const api = Api.getInstance()
  const response = (await api.get({
    path: "onboarding-voice-call-audit/ai-review",
    data: params,
  })) as OnboardingVoiceCallAuditAiReviewListResponse | undefined
  if (response === undefined) {
    throw new Error("No se pudo cargar la revisión IA de voz onboarding")
  }
  return response
}

export async function analyzeOnboardingVoiceCallAuditFlow(
  flowId: string
): Promise<OnboardingVoiceCallAuditRecord> {
  const api = Api.getInstance()
  const response = (await api.post({
    path: `onboarding-voice-call-audit/flows/${encodeURIComponent(flowId)}/analyze`,
    data: {},
  })) as OnboardingVoiceCallAuditRecord | undefined
  if (response === undefined) {
    throw new Error("No se pudo ejecutar el análisis IA")
  }
  return response
}

export async function analyzeOnboardingVoiceCallAuditBackfill(input: {
  from: string
  to: string
  limit?: number
  onlyMissing?: boolean
}): Promise<OnboardingVoiceCallAuditBackfillResponse> {
  const api = Api.getInstance()
  const response = (await api.post({
    path: "onboarding-voice-call-audit/analyze-backfill",
    data: input,
  })) as OnboardingVoiceCallAuditBackfillResponse | undefined
  if (response === undefined) {
    throw new Error("No se pudo ejecutar el backfill de análisis IA")
  }
  return response
}
