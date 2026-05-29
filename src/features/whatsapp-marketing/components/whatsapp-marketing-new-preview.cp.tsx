import { Paper, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import {
  selectWhatsappMarketingAudiencePreview,
  selectWhatsappMarketingAudiencePreviewLoading,
} from "../slice/whatsapp-marketing.selectors"
import {
  selectWhatsappMarketingAudiencePreviewIsStale,
  selectWhatsappMarketingNewCampaignPreviewFields,
  selectWhatsappMarketingNewFormSnapshot,
} from "../slice/whatsapp-marketing-new.selectors"
import { validateWhatsappMarketingCampaignForm } from "../utils/validate-whatsapp-marketing-campaign"

export default function WhatsappMarketingNewPreviewCP() {
  const audiencePreview = useAppSelector(selectWhatsappMarketingAudiencePreview)
  const previewLoading = useAppSelector(selectWhatsappMarketingAudiencePreviewLoading)
  const previewIsStale = useAppSelector(selectWhatsappMarketingAudiencePreviewIsStale)
  const form = useAppSelector(selectWhatsappMarketingNewFormSnapshot)
  const { templateName } = useAppSelector(selectWhatsappMarketingNewCampaignPreviewFields)
  const previewTotal = audiencePreview?.total ?? null
  const excludedNoPhone = audiencePreview?.excludedNoPhone ?? 0
  const validation = validateWhatsappMarketingCampaignForm({
    name: form.name,
    templateName: form.templateName,
    templateLanguage: form.templateLanguage,
    templateParamsText: form.templateParamsText,
    templateHeaderMediaId: form.templateHeaderMediaId,
    templateHeaderMediaType: form.templateHeaderMediaType,
    batchSize: form.batchSize,
    batchDelayMs: form.batchDelayMs,
    campaignType: form.campaignType,
    audienceMode: form.audienceMode,
    manualCustomerCount: form.manualCustomerIds.length,
    previewTotal,
    previewLoading,
    previewIsStale,
  })
  const previewMessage =
    validation.errors.preview ?? validation.errors.audience ?? undefined
  const displayTotal =
    previewLoading || previewIsStale ? "…" : previewTotal ?? "—"

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight={700}>
        {displayTotal}
      </Typography>
      <Typography color="text.secondary">
        destinatarios con teléfono válido · plantilla {templateName || "(sin nombre)"}
      </Typography>
      {excludedNoPhone > 0 && !previewIsStale && !previewLoading ? (
        <Typography color="warning.main" variant="body2">
          {excludedNoPhone} sin teléfono se excluyen
        </Typography>
      ) : null}
      {previewMessage !== undefined ? (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {previewMessage}
        </Typography>
      ) : null}
    </Paper>
  )
}
