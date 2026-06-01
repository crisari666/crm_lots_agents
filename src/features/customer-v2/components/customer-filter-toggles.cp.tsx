import {
  FormControlLabel,
  Stack,
  Switch,
} from "@mui/material"
import type { FilterFormState } from "../types/filter-form.types"

export type CustomerFilterTogglesCPProps = {
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
    >,
  ) => void
}

export default function CustomerFilterTogglesCP({
  filterDraft,
  onFilterDraftChange,
}: CustomerFilterTogglesCPProps) {
  return (
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
            onChange={(_e, checked) => onFilterDraftChange({ excludeFecha: checked })}
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
              onFilterDraftChange({
                unassignedOnly: checked,
                ...(checked ? { assignedTo: "" } : {}),
              })
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
            onChange={(_e, checked) => onFilterDraftChange({ enabledOnly: checked })}
            color="primary"
          />
        }
        label="Solo clientes activos"
        sx={{ mr: 0, width: { xs: "100%", sm: "auto" } }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={filterDraft.referralOnly}
            onChange={(_e, checked) => onFilterDraftChange({ referralOnly: checked })}
            color="primary"
          />
        }
        label="Solo referidos"
        sx={{ mr: 0, width: { xs: "100%", sm: "auto" } }}
      />
    </Stack>
  )
}
