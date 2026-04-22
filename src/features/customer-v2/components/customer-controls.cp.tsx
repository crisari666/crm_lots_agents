import React, { useMemo, useState } from "react"
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import { Add as AddIcon, BarChart as BarChartIcon } from "@mui/icons-material"
import { useAppSelector } from "../../../app/hooks"
import AddCustomerDialogCP from "./add-customer-dialog.cp"
import CustomerStepsDistributionDialogCP from "./customer-steps-distribution-dialog.cp"
import type { FilterFormState } from "../types/filter-form.types"
import { aggregateStepsFromListItems } from "../utils/aggregate-steps-from-list-items"

export type CustomerControlsCPProps = {
  onCustomerCreated?: () => void
  filterDraft: Pick<
    FilterFormState,
    "excludeFecha" | "unassignedOnly" | "enabledOnly"
  >
  onFilterDraftChange: (
    patch: Partial<
      Pick<FilterFormState, "excludeFecha" | "unassignedOnly" | "enabledOnly">
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

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        useFlexGap
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={filterDraft.excludeFecha}
              onChange={(_e, checked) =>
                onFilterDraftChange({ excludeFecha: checked })
              }
              color="primary"
            />
          }
          label="Excluir fecha"
          sx={{ mr: 0, width: { xs: "100%", sm: "auto" } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={filterDraft.unassignedOnly}
              onChange={(_e, checked) =>
                onFilterDraftChange({ unassignedOnly: checked })
              }
              color="primary"
            />
          }
          label="Solo sin asignar"
          sx={{ mr: 0, width: { xs: "100%", sm: "auto" } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={filterDraft.enabledOnly}
              onChange={(_e, checked) =>
                onFilterDraftChange({ enabledOnly: checked })
              }
              color="primary"
            />
          }
          label="Solo clientes activos"
          sx={{ mr: 0, width: { xs: "100%", sm: "auto" } }}
        />
      </Stack>

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
