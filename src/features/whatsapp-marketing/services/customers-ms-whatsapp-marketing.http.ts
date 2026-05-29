import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  AudiencePreviewBody,
  AudiencePreviewResponse,
  CreateWhatsappMarketingCampaignBody,
  WhatsappMarketingCampaignDetail,
  WhatsappMarketingCampaignListResponse,
  WhatsappMarketingRecipientListResponse,
} from "./customers-ms-whatsapp-marketing.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function previewWhatsappMarketingAudience(
  body: AudiencePreviewBody
): Promise<AudiencePreviewResponse> {
  const response = await customersMsAxios.post<AudiencePreviewResponse>(
    "admin/whatsapp-marketing/audience-preview",
    body,
    auth()
  )
  return response.data
}

export async function createWhatsappMarketingCampaign(
  body: CreateWhatsappMarketingCampaignBody
): Promise<WhatsappMarketingCampaignDetail> {
  const response = await customersMsAxios.post<WhatsappMarketingCampaignDetail>(
    "admin/whatsapp-marketing/campaigns",
    body,
    auth()
  )
  return response.data
}

export async function updateWhatsappMarketingCampaign(
  campaignId: string,
  body: Partial<CreateWhatsappMarketingCampaignBody>
): Promise<WhatsappMarketingCampaignDetail> {
  const response = await customersMsAxios.patch<WhatsappMarketingCampaignDetail>(
    `admin/whatsapp-marketing/campaigns/${campaignId}`,
    body,
    auth()
  )
  return response.data
}

export async function listWhatsappMarketingCampaigns(params?: {
  limit?: number
  skip?: number
}): Promise<WhatsappMarketingCampaignListResponse> {
  const response = await customersMsAxios.get<WhatsappMarketingCampaignListResponse>(
    "admin/whatsapp-marketing/campaigns",
    { params, ...auth() }
  )
  return response.data
}

export async function getWhatsappMarketingCampaign(
  campaignId: string
): Promise<WhatsappMarketingCampaignDetail> {
  const response = await customersMsAxios.get<WhatsappMarketingCampaignDetail>(
    `admin/whatsapp-marketing/campaigns/${campaignId}`,
    auth()
  )
  return response.data
}

export async function listWhatsappMarketingRecipients(
  campaignId: string,
  params?: { status?: string; limit?: number; skip?: number }
): Promise<WhatsappMarketingRecipientListResponse> {
  const response = await customersMsAxios.get<WhatsappMarketingRecipientListResponse>(
    `admin/whatsapp-marketing/campaigns/${campaignId}/recipients`,
    { params, ...auth() }
  )
  return response.data
}

export async function launchWhatsappMarketingCampaign(
  campaignId: string
): Promise<WhatsappMarketingCampaignDetail> {
  const response = await customersMsAxios.post<WhatsappMarketingCampaignDetail>(
    `admin/whatsapp-marketing/campaigns/${campaignId}/launch`,
    {},
    auth()
  )
  return response.data
}

export async function cancelWhatsappMarketingCampaign(
  campaignId: string
): Promise<WhatsappMarketingCampaignDetail> {
  const response = await customersMsAxios.post<WhatsappMarketingCampaignDetail>(
    `admin/whatsapp-marketing/campaigns/${campaignId}/cancel`,
    {},
    auth()
  )
  return response.data
}

export async function retryWhatsappMarketingRecipient(
  campaignId: string,
  recipientId: string
): Promise<void> {
  await customersMsAxios.post(
    `admin/whatsapp-marketing/campaigns/${campaignId}/recipients/${recipientId}/retry`,
    {},
    auth()
  )
}
