import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import {
  selectWhatsappMarketingListError,
  selectWhatsappMarketingListItems,
  selectWhatsappMarketingListLoading,
} from "../slice/whatsapp-marketing.selectors"

function statusColor(status: string): "default" | "success" | "warning" | "error" | "info" {
  if (status === "completed") return "success"
  if (status === "sending" || status === "building") return "info"
  if (status === "failed" || status === "cancelled") return "error"
  if (status === "draft") return "warning"
  return "default"
}

export default function WhatsappMarketingListCP() {
  const items = useAppSelector(selectWhatsappMarketingListItems)
  const loading = useAppSelector(selectWhatsappMarketingListLoading)
  const error = useAppSelector(selectWhatsappMarketingListError)
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Campañas WhatsApp
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/dashboard/whatsapp-marketing/new"
          sx={{ cursor: "pointer" }}
        >
          Nueva campaña
        </Button>
      </Stack>
      {error != null ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : null}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Plantilla</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Enviados</TableCell>
              <TableCell align="right">Fallidos</TableCell>
              <TableCell>Creada</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} hover sx={{ cursor: "default" }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.templateName}</TableCell>
                <TableCell>
                  {row.campaignType === "recovery_potential" ? "Recuperación" : "Estándar"}
                </TableCell>
                <TableCell>
                  <Chip size="small" label={row.status} color={statusColor(row.status)} />
                </TableCell>
                <TableCell align="right">{row.stats.sent}</TableCell>
                <TableCell align="right">{row.stats.failed}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/dashboard/whatsapp-marketing/${row.id}`}
                    sx={{ cursor: "pointer" }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No hay campañas. Crea la primera.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
