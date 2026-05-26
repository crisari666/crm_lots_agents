import { Box, Typography } from "@mui/material"
import { AppConstants } from "../../../app/app-constants"
import { callAuditStrings as s } from "../../../i18n/locales/call-audit.strings"
import CustomerDetailDialogCP from "../components/customer-detail-dialog.cp"
import CallAuditProgressFiltersCP from "../components/call-audit/call-audit-progress-filters.cp"
import CallAuditProgressTableCP from "../components/call-audit/call-audit-progress-table.cp"

export default function CallAuditQueuePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.subtitle} Mínimo mensual: {AppConstants.call_audit_required_per_month} llamadas por asesor.
      </Typography>
      <CallAuditProgressFiltersCP />
      <CallAuditProgressTableCP />
      <CustomerDetailDialogCP />
    </Box>
  )
}
