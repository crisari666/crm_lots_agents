import type {
  AudiencePreviewResponse,
  WhatsappMarketingCampaignDetail,
  WhatsappMarketingCampaignListItem,
  WhatsappMarketingRecipientListItem,
} from "../services/customers-ms-whatsapp-marketing.types"

export type WhatsappMarketingCreateStatus = "idle" | "submitting" | "success" | "error"

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
  readonly createStatus: WhatsappMarketingCreateStatus
  readonly createError: string | null
  readonly lastCreatedCampaignId: string | null
}
