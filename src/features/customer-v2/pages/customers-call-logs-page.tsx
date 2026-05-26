import { Box, Typography } from "@mui/material"
import CallLogsFiltersCP from "../components/call-logs/call-logs-filters.cp"
import CallLogsListCP from "../components/call-logs/call-logs-list.cp"
import CustomerDetailDialogCP from "../components/customer-detail-dialog.cp"

export default function CustomersCallLogsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Registro de llamadas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Llamadas registradas en CRM (Twilio / voz). Estado derivado del último evento antes de
        &quot;completed&quot;.
      </Typography>

      <CallLogsFiltersCP />
      <CallLogsListCP />
      <CustomerDetailDialogCP />
    </Box>
  )
}
