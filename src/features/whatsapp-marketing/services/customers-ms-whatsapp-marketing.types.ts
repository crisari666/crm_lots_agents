export type WhatsappMarketingAudienceMode = "filter" | "manual" | "combined"

export type WhatsappMarketingCampaignType = "standard" | "recovery_potential"

export type WhatsappMarketingCampaignStatus =
  | "draft"
  | "building"
  | "sending"
  | "completed"
  | "cancelled"
  | "failed"

export type WhatsappMarketingRecipientStatus =
  | "pending"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "cancelled"
  | "replied"

export type MarketingAudienceFilterBody = {
  omitDateRange?: boolean
  createdFrom?: string
  createdTo?: string
  assignedTo?: string
  unassignedOnly?: boolean
  enabled?: boolean
  isReferral?: boolean
  search?: string
  customerStepIds?: string[]
}

export type AudiencePreviewBody = {
  audienceMode: WhatsappMarketingAudienceMode
  audienceFilter?: MarketingAudienceFilterBody
  manualCustomerIds?: string[]
}

export type AudiencePreviewResponse = {
  total: number
  excludedNoPhone: number
  mode: WhatsappMarketingAudienceMode
}

export type CreateWhatsappMarketingCampaignBody = {
  name: string
  templateName: string
  templateLanguage?: string
  templateComponents?: Record<string, unknown>[]
  audienceMode: WhatsappMarketingAudienceMode
  audienceFilter?: MarketingAudienceFilterBody
  manualCustomerIds?: string[]
  campaignType?: WhatsappMarketingCampaignType
  preserveAssigneeCustomerStepIds?: string[]
  replyAdvanceToCustomerStepId?: string
  batchSize: number
  batchDelayMs?: number
}

export type WhatsappMarketingCampaignStats = {
  total: number
  pending: number
  sent: number
  delivered: number
  read: number
  failed: number
  cancelled: number
}

export type WhatsappMarketingCampaignListItem = {
  id: string
  name: string
  templateName: string
  campaignType: WhatsappMarketingCampaignType
  status: WhatsappMarketingCampaignStatus
  stats: WhatsappMarketingCampaignStats
  createdAt: string
}

export type WhatsappMarketingCampaignDetail = WhatsappMarketingCampaignListItem & {
  templateLanguage: string
  templateComponents?: Record<string, unknown>[]
  audienceMode: WhatsappMarketingAudienceMode
  audienceFilter?: MarketingAudienceFilterBody
  manualCustomerIds: string[]
  preserveAssigneeCustomerStepIds: string[]
  replyAdvanceToCustomerStepId?: string
  batchSize: number
  batchDelayMs: number
  updatedAt: string
}

export type WhatsappMarketingRecipientListItem = {
  id: string
  customerId: string
  phone: string
  customerName: string
  customerStepName?: string
  status: WhatsappMarketingRecipientStatus
  whatsappMessageId?: string
  attemptCount: number
  lastStatusAt?: string
  lastStatusSource?: "api" | "webhook"
  errorMessage?: string
  statusHistory: Array<{
    status: string
    at: string
    source: "api" | "webhook"
    detail?: string
  }>
  repliedAt?: string
  replyType?: "button" | "text"
  replyOutcome?: string
}

export type WhatsappMarketingCampaignListResponse = {
  items: WhatsappMarketingCampaignListItem[]
  total: number
  limit: number
  skip: number
}

export type WhatsappMarketingRecipientListResponse = {
  items: WhatsappMarketingRecipientListItem[]
  total: number
  limit: number
  skip: number
}
