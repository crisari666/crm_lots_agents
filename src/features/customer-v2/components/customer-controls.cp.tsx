import React, { useMemo, useState } from "react"
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material"
import { Add as AddIcon, BarChart as BarChartIcon } from "@mui/icons-material"
import { useAppSelector } from "../../../app/hooks"
import AddCustomerDialogCP from "./add-customer-dialog.cp"
import CustomerFilterTogglesCP from "./customer-filter-toggles.cp"
import CustomerStepsDistributionDialogCP from "./customer-steps-distribution-dialog.cp"
import type { FilterFormState } from "../types/filter-form.types"
import { aggregateStepsFromListItems } from "../utils/aggregate-steps-from-list-items"

export type CustomerControlsCPProps = {
  onCustomerCreated?: () => void
  filterDraft: Pick<
    FilterFormState,
    "excludeFecha" | "unassignedOnly" | "enabledOnly" | "referralOnly"
  >
  onFilterDraftChange: (
    patch: Partial<
      Pick<
        FilterFormState,
        "excludeFecha" | "unassignedOnly" | "enabledOnly" | "referralOnly"
      >
    >
  ) => void
}

export default function CustomerControlsCP({
  onCustomerCreated,
  filterDraft,
  onFilterDraftChange,
}: CustomerControlsCPProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stepsChartOpen, setStepsChartOpen] = useState(false)
  const listItems = useAppSelector((s) => s.customerV2.listItems)
  const stepChartRows = useMemo(() => aggregateStepsFromListItems(listItems), [listItems])

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Clientes V2
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<BarChartIcon />}
            onClick={() => setStepsChartOpen(true)}
            sx={{ cursor: "pointer" }}
          >
            Gráfico por paso
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ cursor: "pointer" }}
          >
            Nuevo cliente
          </Button>
        </Stack>
      </Box>

      <CustomerFilterTogglesCP
        filterDraft={filterDraft}
        onFilterDraftChange={onFilterDraftChange}
      />

      <AddCustomerDialogCP
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCustomerCreated={onCustomerCreated}
      />
      <CustomerStepsDistributionDialogCP
        open={stepsChartOpen}
        onClose={() => setStepsChartOpen(false)}
        rows={stepChartRows}
        pageRowCount={listItems.length}
      />
    </Box>
  )
}
