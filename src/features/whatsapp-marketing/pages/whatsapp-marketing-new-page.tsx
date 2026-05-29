import { Box, Stack, Typography } from "@mui/material"
import WhatsappMarketingNewLifecycleCP from "../components/whatsapp-marketing-new-lifecycle.cp"
import WhatsappMarketingNewErrorsCP from "../components/whatsapp-marketing-new-errors.cp"
import WhatsappMarketingNewConfigCP from "../components/whatsapp-marketing-new-config.cp"
import WhatsappMarketingNewAudienceCP from "../components/whatsapp-marketing-new-audience.cp"
import WhatsappMarketingNewPreviewCP from "../components/whatsapp-marketing-new-preview.cp"
import WhatsappMarketingNewSubmitCP from "../components/whatsapp-marketing-new-submit.cp"

export default function WhatsappMarketingNewPage() {
  return (
    <Box>
      <WhatsappMarketingNewLifecycleCP />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Nueva campaña WhatsApp
      </Typography>
      <WhatsappMarketingNewErrorsCP />
      <Stack spacing={2}>
        <WhatsappMarketingNewConfigCP />
        <WhatsappMarketingNewAudienceCP />
        <WhatsappMarketingNewPreviewCP />
        <WhatsappMarketingNewSubmitCP />
      </Stack>
    </Box>
  )
}
