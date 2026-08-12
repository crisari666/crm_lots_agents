import { Box, Stack, Typography } from "@mui/material"
import { PriceChange } from "@mui/icons-material"
import CustomerPaymentsAuditoryPanelCP from "../components/customer-payments-auditory-panel.cp"

export default function CustomerPaymentsAuditoryPage() {
  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <PriceChange fontSize="small" />
          </Box>
          <Stack spacing={0.25}>
            <Typography variant="h5" component="h1" fontWeight={700} lineHeight={1.2}>
              Pagos de Clientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Separaciones (enganche) y abonos por proyecto
            </Typography>
          </Stack>
        </Stack>
        <CustomerPaymentsAuditoryPanelCP />
      </Stack>
    </Box>
  )
}
