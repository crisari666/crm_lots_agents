import type {
  CallAuditAiReviewPageLimit,
  ListCallAuditAiReviewParams,
} from "../services/customers-ms-admin-call-audit.types"

export type CallAuditAiReviewFilters = {
  month: string
  agentExternalRef: string
  onlyWithoutAi: boolean
  excludeWithoutTranscript: boolean
  page: number
  limit: CallAuditAiReviewPageLimit
}

export function buildCallAuditAiReviewParams(
  filters: CallAuditAiReviewFilters
): ListCallAuditAiReviewParams {
  return {
    month: filters.month,
    skip: filters.page * filters.limit,
    limit: filters.limit,
    ...(filters.agentExternalRef.trim() !== ""
      ? { agentExternalRef: filters.agentExternalRef.trim() }
      : {}),
    ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
    ...(filters.excludeWithoutTranscript ? {} : { excludeWithoutTranscript: false }),
  }
}
