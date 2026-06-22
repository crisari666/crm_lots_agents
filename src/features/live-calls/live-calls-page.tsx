import { Box, Typography } from "@mui/material"
import LiveCallsListCP from "./components/live-calls-list.cp"

export default function LiveCallsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Llamadas en vivo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Supervisa y entrena llamadas activas en tiempo real. Únete en modo coach para hablar solo
        con el agente o envía notas de texto durante la llamada.
      </Typography>
      <LiveCallsListCP />
    </Box>
  )
}
