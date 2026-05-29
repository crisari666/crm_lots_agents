import type { FilterFormState } from "../../customer-v2/types/filter-form.types"
import type {
  WhatsappMarketingAudienceMode,
  WhatsappMarketingCampaignType,
} from "../services/customers-ms-whatsapp-marketing.types"
import type { WhatsappMarketingCampaignFieldErrors } from "../utils/validate-whatsapp-marketing-campaign"

export type WhatsappMarketingNewFormSnapshot = {
  readonly name: string
  readonly templateName: string
  readonly templateLanguage: string
  readonly templateParamsText: string
  readonly batchSize: number
  readonly batchDelayMs: number
  readonly campaignType: WhatsappMarketingCampaignType
  readonly audienceMode: WhatsappMarketingAudienceMode
  readonly applied: FilterFormState
  readonly selectedStepIds: readonly string[]
  readonly manualCustomerIds: readonly string[]
  readonly preserveStepIds: readonly string[]
  readonly advanceStepId: string
}

export type WhatsappMarketingNewFieldErrorKey = keyof WhatsappMarketingCampaignFieldErrors

export type WhatsappMarketingNewClearFieldError = (
  key: WhatsappMarketingNewFieldErrorKey,
) => void
