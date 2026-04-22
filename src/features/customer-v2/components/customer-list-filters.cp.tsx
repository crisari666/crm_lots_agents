import React from "react"
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import UserInterface from "../../../app/models/user-interface"
import type { CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"
import type { FilterFormState } from "../types/filter-form.types"
import AssignUserAutocompleteCP from "./assign-user-autocomplete.cp"

export type CustomerListFiltersCPProps = {
  draft: FilterFormState
  setDraft: React.Dispatch<React.SetStateAction<FilterFormState>>
  loading: boolean
  onSearch: () => void
  users: UserInterface[]
  steps: CustomerStepV2[]
}

export default function CustomerListFiltersCP({
  draft,
  setDraft,
  loading,
  onSearch,
  users,
  steps,
}: CustomerListFiltersCPProps) {
  const clearDateFilters = () => {
    setDraft((prev) => ({ ...prev, createdFrom: null, createdTo: null }))
  }

  const onStepChange = (e: SelectChangeEvent<string>) => {
    setDraft((prev) => ({ ...prev, customerStepId: e.target.value }))
  }

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Filtros
          </Typography>
          <TextField
            size="small"
            placeholder="Buscar por nombre, email o teléfono…"
            value={draft.search}
            onChange={(e) => setDraft((prev) => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault()
                onSearch()
              }
            }}
            sx={{ minWidth: { xs: 1, md: 320 }, maxWidth: 480 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onSearch}
            disabled={loading}
            sx={{ cursor: "pointer", alignSelf: { xs: "stretch", md: "center" } }}
          >
            Buscar
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <DatePicker
            label="Creado desde"
            value={draft.createdFrom}
            onChange={(v) => setDraft((prev) => ({ ...prev, createdFrom: v }))}
            disabled={draft.excludeFecha}
            slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
          />
          <DatePicker
            label="Creado hasta"
            value={draft.createdTo}
            onChange={(v) => setDraft((prev) => ({ ...prev, createdTo: v }))}
            disabled={draft.excludeFecha}
            slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
          />
          <Box sx={{ minWidth: { xs: "100%", sm: 280 }, flex: { sm: "1 1 280px" } }}>
            <AssignUserAutocompleteCP
              users={users}
              value={draft.unassignedOnly ? "" : draft.assignedTo}
              onChange={(userId) =>
                setDraft((prev) => ({
                  ...prev,
                  assignedTo: userId,
                  ...(userId ? { unassignedOnly: false } : {}),
                }))
              }
              disabled={draft.unassignedOnly}
              label="Usuario asignado"
              size="small"
            />
          </Box>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
            <InputLabel id="customer-v2-step-filter-label">Paso CRM</InputLabel>
            <Select
              labelId="customer-v2-step-filter-label"
              label="Paso CRM"
              value={draft.customerStepId}
              onChange={onStepChange}
            >
              <MenuItem value="">
                <em>Todos los pasos</em>
              </MenuItem>
              {steps.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.25 }}>
                    {s.color?.trim() ? (
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: s.color,
                          flexShrink: 0,
                          border: 1,
                          borderColor: "divider",
                        }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "action.disabledBackground",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography variant="body2" component="span">
                      {s.name}
                      {!s.isActive ? " (inactivo)" : ""}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!draft.excludeFecha && (draft.createdFrom || draft.createdTo) && (
            <Typography
              component="button"
              type="button"
              onClick={clearDateFilters}
              sx={{
                cursor: "pointer",
                border: "none",
                background: "none",
                color: "primary.main",
                textDecoration: "underline",
                fontSize: "0.875rem",
                p: 0,
                alignSelf: "center",
              }}
            >
              Limpiar fechas
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
