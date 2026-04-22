import type { CeoOperationsSummaryResult } from "../../../app/services/ceo-operations-summary.service"

export type CeoOperationsSummaryState = {
  readonly summary: CeoOperationsSummaryResult | null
  readonly crmV2Total: number | null
  /** True when `VITE_URL_CUSTOMERS_MS` is unset (CRM V2 count not requested). */
  readonly crmV2Skipped: boolean
  readonly isLoading: boolean
  readonly error: string | null
  readonly crmError: string | null
}
