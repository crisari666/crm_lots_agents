import { Box, Typography } from "@mui/material"
import CustomerDetailDialogCP from "../../customer-v2/components/customer-detail-dialog.cp"
import { customerAssignmentAuditStrings as s } from "../../../i18n/locales/customer-assignment-audit.strings"
import CustomerAssignmentAuditFiltersCP from "../components/customer-assignment-audit-filters.cp"
import CustomerAssignmentAuditTableCP from "../components/customer-assignment-audit-table.cp"

export default function CustomerAssignmentAuditPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.subtitle}
      </Typography>
      <CustomerAssignmentAuditFiltersCP />
      <CustomerAssignmentAuditTableCP />
      <CustomerDetailDialogCP />
    </Box>
  )
}
