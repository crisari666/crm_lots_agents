import { Box, Typography } from "@mui/material"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"

export default function MetaLeadFormsHeaderCP() {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
        {s.subtitle}
      </Typography>
    </Box>
  )
}
