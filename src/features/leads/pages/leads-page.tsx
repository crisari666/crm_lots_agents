import { Box, Typography } from "@mui/material"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import LeadsFiltersCP from "../components/leads-filters.cp"
import LeadsNoticeCP from "../components/leads-notice.cp"
import LeadsTableCP from "../components/leads-table.cp"

/**
 * Admin leads inbox: audit Meta / WA sources, open customer detail, convert lead → customer.
 */
export default function LeadsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
        {s.subtitle}
      </Typography>
      <LeadsFiltersCP />
      <LeadsTableCP />
      <LeadsNoticeCP />
    </Box>
  )
}
