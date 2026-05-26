export type OnboardingVoiceCallAuditIndicator = {
  key: string
  label: string
  passed: boolean
  rationale?: string
  evidence?: string
}

export type OnboardingVoiceCallAuditSpeakerTurn = {
  role: "agent" | "customer"
  text: string
}

export type OnboardingVoiceCallAuditRecord = {
  id: string
  flowId: string
  transcriptEventAt: string
  callSid?: string
  agentExternalRef: string
  source: "ai"
  configVersion: string
  indicators: OnboardingVoiceCallAuditIndicator[]
  interestScore: number
  interestScoreRationale?: string
  speakerTurns?: OnboardingVoiceCallAuditSpeakerTurn[]
  isVoicemail: boolean
  status: "pending" | "completed" | "failed"
  llmModel?: string
  llmError?: string
  analyzedAt?: string
  createdAt: string
  updatedAt: string
}

export type OnboardingVoiceCallAuditConfigResponse = {
  configVersion: string
  voicemailIndicator: { key: string; label: string; description: string }
  indicators: Array<{ key: string; label: string; description: string }>
  interestScore: {
    min: number
    max: number
    labels: Record<number, string>
  }
}

export type OnboardingVoiceCallAuditAiReviewItem = {
  flowId: string
  phoneNumber: string
  leadName: string
  transcriptEventAt: string
  callSid?: string
  isVoicemailFlow: boolean
  aiStatus: "none" | "pending" | "completed" | "failed"
  ai: OnboardingVoiceCallAuditRecord | null
}

export type OnboardingVoiceCallAuditAiReviewSummary = {
  dateBasis: "transcriptEventAt"
  totalEligible: number
  aiCompleted: number
  aiPending: number
  aiFailed: number
  aiNone: number
  avgInterestScore: number | null
  topFailedIndicators: Array<{ label: string; count: number }>
}

export type OnboardingVoiceCallAuditAiReviewListResponse = {
  month: string
  items: OnboardingVoiceCallAuditAiReviewItem[]
  total: number
  skip: number
  limit: number
  summary: OnboardingVoiceCallAuditAiReviewSummary
}

export type OnboardingVoiceCallAuditBackfillResponse = {
  processed: number
  skipped: number
  failed: number
  errors: Array<{ flowId: string; message: string }>
}

export type ListOnboardingVoiceCallAuditAiReviewParams = {
  month: string
  onlyWithoutAi?: boolean
  skip?: number
  limit?: number
}
