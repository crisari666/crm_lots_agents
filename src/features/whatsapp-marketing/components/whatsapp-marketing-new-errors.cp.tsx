import { Alert } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import {
  selectWhatsappMarketingAudiencePreviewError,
  selectWhatsappMarketingCreateError,
} from "../slice/whatsapp-marketing.selectors"

export default function WhatsappMarketingNewErrorsCP() {
  const createError = useAppSelector(selectWhatsappMarketingCreateError)
  const previewError = useAppSelector(selectWhatsappMarketingAudiencePreviewError)
  const error = createError ?? previewError ?? ""
  if (error === "") {
    return null
  }
  return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
}
