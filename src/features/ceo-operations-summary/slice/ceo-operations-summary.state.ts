import type {
  CeoLeadResumeResult,
  CeoOperationsSummaryResult,
} from "../../../app/services/ceo-operations-summary.types"

export type CeoOperationsSummaryState = {
  readonly summary: CeoOperationsSummaryResult | null
  readonly crmV2Total: number | null
  readonly crmV2ReferralTotal: number | null
  /** True when `VITE_URL_CUSTOMERS_MS` is unset (CRM V2 count not requested). */
  readonly crmV2Skipped: boolean
  readonly isLoading: boolean
  readonly error: string | null
  readonly crmError: string | null
  readonly leadsResume: CeoLeadResumeResult | null
  readonly isLeadsResumeLoading: boolean
  readonly leadsResumeError: string | null
}
