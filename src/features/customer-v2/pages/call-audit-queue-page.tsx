import { Box, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../i18n/locales/call-audit.strings"
import CustomerDetailDialogCP from "../components/customer-detail-dialog.cp"
import CallAuditAuditorProgressTableCP from "../components/call-audit/call-audit-auditor-progress-table.cp"
import CallAuditResultsFiltersCP from "../components/call-audit/call-audit-results-filters.cp"
import CallAuditResultsTableCP from "../components/call-audit/call-audit-results-table.cp"

export default function CallAuditQueuePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.queuePageSubtitle}
      </Typography>
      <CallAuditResultsFiltersCP />
      <CallAuditAuditorProgressTableCP />
      <CallAuditResultsTableCP />
      <CustomerDetailDialogCP />
    </Box>
  )
}
