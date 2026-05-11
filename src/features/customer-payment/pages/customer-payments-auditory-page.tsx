import { Stack, Typography } from "@mui/material"
import { PriceChange } from "@mui/icons-material"
import CustomerPaymentsAuditoryPanelCP from "../components/customer-payments-auditory-panel.cp"

export default function CustomerPaymentsAuditoryPage() {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <PriceChange fontSize="small" />
        <Typography variant="h5" component="h1">
          Pagos de Clientes
        </Typography>
      </Stack>
      <CustomerPaymentsAuditoryPanelCP />
    </Stack>
  )
}
