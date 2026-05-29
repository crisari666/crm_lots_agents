import type { FilterFormState } from "../../customer-v2/types/filter-form.types"
import type { CustomerAutocompleteItem } from "../../customer-v2/services/customers-ms.service"
import type { CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"
import type {
  AudiencePreviewResponse,
  WhatsappMarketingAudienceMode,
  WhatsappMarketingCampaignDetail,
  WhatsappMarketingCampaignListItem,
  WhatsappMarketingCampaignType,
  WhatsappMarketingRecipientListItem,
} from "../services/customers-ms-whatsapp-marketing.types"
import type { WhatsappMarketingCampaignFieldErrors } from "../utils/validate-whatsapp-marketing-campaign"
import { emptyMarketingCampaignAudienceFilters } from "../utils/build-marketing-audience-filter"

export type WhatsappMarketingCreateStatus = "idle" | "submitting" | "success" | "error"

export type WhatsappMarketingNewCampaignFormState = {
  readonly name: string
  readonly templateName: string
  readonly templateLanguage: string
  readonly templateParamsText: string
  readonly batchSize: number
  readonly batchDelayMs: number
  readonly campaignType: WhatsappMarketingCampaignType
  readonly audienceMode: WhatsappMarketingAudienceMode
  readonly draft: FilterFormState
  readonly applied: FilterFormState
  readonly selectedStepIds: string[]
  readonly preserveStepIds: string[]
  readonly advanceStepId: string
  readonly manualPicks: CustomerAutocompleteItem[]
  readonly picker: CustomerAutocompleteItem | null
  readonly fieldErrors: WhatsappMarketingCampaignFieldErrors
  readonly steps: CustomerStepV2[]
}

export function createInitialWhatsappMarketingNewCampaignForm(): WhatsappMarketingNewCampaignFormState {
  return {
    name: "",
    templateName: "",
    templateLanguage: "es",
    templateParamsText: "",
    batchSize: 5,
    batchDelayMs: 200,
    campaignType: "standard",
    audienceMode: "filter",
    draft: emptyMarketingCampaignAudienceFilters(),
    applied: emptyMarketingCampaignAudienceFilters(),
    selectedStepIds: [],
    preserveStepIds: [],
    advanceStepId: "",
    manualPicks: [],
    picker: null,
    fieldErrors: {},
    steps: [],
  }
}

export type WhatsappMarketingState = {
  readonly listItems: WhatsappMarketingCampaignListItem[]
  readonly listLoading: boolean
  readonly listError: string | null
  readonly detailCampaignId: string | null
  readonly detailCampaign: WhatsappMarketingCampaignDetail | null
  readonly detailLoading: boolean
  readonly detailError: string | null
  readonly recipients: WhatsappMarketingRecipientListItem[]
  readonly recipientsStatusFilter: string
  readonly recipientsLoading: boolean
  readonly retryingRecipientId: string | null
  readonly cancelLoading: boolean
  readonly audiencePreview: AudiencePreviewResponse | null
  readonly audiencePreviewLoading: boolean
  readonly audiencePreviewError: string | null
  readonly audiencePreviewRequestKey: string | null
  readonly createStatus: WhatsappMarketingCreateStatus
  readonly createError: string | null
  readonly lastCreatedCampaignId: string | null
  readonly newCampaignForm: WhatsappMarketingNewCampaignFormState
}
