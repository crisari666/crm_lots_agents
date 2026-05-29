import { Paper, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import {
  selectWhatsappMarketingAudiencePreview,
  selectWhatsappMarketingAudiencePreviewLoading,
} from "../slice/whatsapp-marketing.selectors"
import { selectWhatsappMarketingNewCampaignPreviewFields } from "../slice/whatsapp-marketing-new.selectors"

export default function WhatsappMarketingNewPreviewCP() {
  const audiencePreview = useAppSelector(selectWhatsappMarketingAudiencePreview)
  const previewLoading = useAppSelector(selectWhatsappMarketingAudiencePreviewLoading)
  const { templateName, previewFieldError } = useAppSelector(
    selectWhatsappMarketingNewCampaignPreviewFields,
  )
  const previewTotal = audiencePreview?.total ?? null
  const excludedNoPhone = audiencePreview?.excludedNoPhone ?? 0

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight={700}>
        {previewLoading ? "…" : previewTotal ?? "—"}
      </Typography>
      <Typography color="text.secondary">
        destinatarios con teléfono válido · plantilla {templateName || "(sin nombre)"}
      </Typography>
      {excludedNoPhone > 0 ? (
        <Typography color="warning.main" variant="body2">
          {excludedNoPhone} sin teléfono se excluyen
        </Typography>
      ) : null}
      {previewFieldError !== undefined ? (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {previewFieldError}
        </Typography>
      ) : null}
    </Paper>
  )
}
