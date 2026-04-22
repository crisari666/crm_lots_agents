import React from "react"
import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import type { CustomerStepDistributionItem } from "../services/customers-ms.service"
import CustomerStepsDistributionBarChartCP from "./customer-steps-distribution-bar-chart.cp"

export type CustomerStepsDistributionDialogCPProps = {
  open: boolean
  onClose: () => void
  /** Aggregated from current table rows (same page as list). */
  rows: CustomerStepDistributionItem[]
  pageRowCount: number
}

export default function CustomerStepsDistributionDialogCP({
  open,
  onClose,
  rows,
  pageRowCount,
}: CustomerStepsDistributionDialogCPProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Clientes por paso CRM</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Basado solo en filas visibles en la tabla (página actual).
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Filas en esta página: {pageRowCount}
        </Typography>
        {rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sin filas para graficar.
          </Typography>
        ) : (
          <Box sx={{ width: "100%", minHeight: 280 }}>
            <CustomerStepsDistributionBarChartCP rows={rows} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
