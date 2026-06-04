import type { WhatsappMarketingCampaignStats } from "../services/customers-ms-whatsapp-marketing.types"

export function formatCampaignStatValue(
  stats: WhatsappMarketingCampaignStats | undefined,
  key: keyof WhatsappMarketingCampaignStats
): number {
  const value = stats?.[key]
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}
