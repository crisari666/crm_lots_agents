export type CallAuditIndicatorConfig = {
  key: string
  label: string
  description: string
  maxPoints: number
}

export type CallAuditIndicatorResult = {
  key: string
  label: string
  passed: boolean
  maxPoints: number
  pointsEarned: number
  rationale?: string
  evidence?: string
}

export type CallAuditSpeakerTurn = {
  role: "agent" | "customer"
  text: string
  startMs?: number
  endMs?: number
  speakerLabel?: string
}

export type CallAuditUtterance = {
  speaker?: string
  text?: string
  start?: number
  end?: number
}

export type CallAuditRecord = {
  id: string
  callLogId: string
  callSid: string
  agentExternalRef: string
  source: "human" | "ai"
  configVersion: string
  indicators: CallAuditIndicatorResult[]
  totalScore: number
  maxScore: number
  interestScore: number
  interestScoreRationale?: string
  speakerTurns?: CallAuditSpeakerTurn[]
  auditorUserId?: string
  reviewerNotes?: string
  status: "pending" | "completed" | "failed"
  llmModel?: string
  llmError?: string
  analyzedAt?: string
  createdAt: string
  updatedAt: string
}

export type CallAuditConfigResponse = {
  configVersion: string
  indicators: CallAuditIndicatorConfig[]
  interestScore: {
    min: number
    max: number
    labels: Record<number, string>
  }
  requiredHumanAuditsPerMonth: number
}

export type CallAuditsByCallResponse = {
  callLogId: string
  callSid: string
  agentExternalRef?: string
  transcript?: string
  resolvedOutcome?: string
  durationSeconds?: number
  utterances?: CallAuditUtterance[]
  human: CallAuditRecord | null
  ai: CallAuditRecord | null
}

export type CallAuditIndicatorsSummary = {
  passed: number
  total: number
  failedLabels: string[]
  earnedPoints: number
  maxPoints: number
  scorePercent: number
}

export type CallAuditResultItem = {
  callLogId: string
  callSid: string
  agentExternalRef: string
  completedAt?: string
  auditorUserId: string
  reviewerNotes?: string
  interestScore: number
  totalScore: number
  maxScore: number
  indicatorsSummary: CallAuditIndicatorsSummary
  analyzedAt?: string
}

export type CallAuditResultsResponse = {
  month: string
  items: CallAuditResultItem[]
}

export type CallAuditAuditorProgressRow = {
  auditorUserId: string
  humanAuditCount: number
}

export type CallAuditAuditorProgressResponse = {
  month: string
  required: number
  auditors: CallAuditAuditorProgressRow[]
}

export type ListCallAuditAuditorProgressParams = {
  month: string
}

export type SubmitHumanCallAuditBody = {
  indicators: Array<{ key: string; passed: boolean; rationale?: string }>
  interestScore: number
  interestScoreRationale?: string
  reviewerNotes?: string
}

export type ListCallAuditResultsParams = {
  month: string
  agentExternalRef?: string
}

export type CallAuditAiReviewItem = {
  callLogId: string
  callSid: string
  agentExternalRef: string
  completedAt?: string
  durationSeconds?: number
  hasTranscript: boolean
  aiStatus: "none" | "pending" | "completed" | "failed"
  ai: CallAuditRecord | null
}

export type CallAuditAiReviewPageLimit = 25 | 50 | 100 | 200

export type CallAuditAiReviewSummary = {
  dateBasis: "callCompletedAt"
  totalEligible: number
  aiCompleted: number
  aiPending: number
  aiFailed: number
  aiNone: number
  avgInterestScore: number | null
  avgTotalScore: number | null
  topFailedIndicators: Array<{ label: string; count: number }>
}

export type CallAuditAiReviewListResponse = {
  month: string
  items: CallAuditAiReviewItem[]
  total: number
  skip: number
  limit: number
  summary: CallAuditAiReviewSummary
}

export type ListCallAuditAiReviewParams = {
  month: string
  agentExternalRef?: string
  onlyWithoutAi?: boolean
  excludeWithoutTranscript?: boolean
  skip?: number
  limit?: number
}
