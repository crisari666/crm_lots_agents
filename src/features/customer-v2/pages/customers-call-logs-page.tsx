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
        Llamadas VoIP (Twilio) y reuniones Google Meet de asesores. Para VoIP, el estado se deriva
        del último evento antes de &quot;completed&quot;. Meet: atendida si hubo conferencia al
        marcar la visita como hecha; no atendida si no hubo.
      </Typography>

      <CallLogsFiltersCP />
      <CallLogsListCP />
      <CustomerDetailDialogCP />
    </Box>
  )
}
