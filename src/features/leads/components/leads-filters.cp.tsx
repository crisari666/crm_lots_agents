import React, { useEffect } from "react"
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { Refresh } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import { fetchLeadsThunk, setLeadsFiltersAct } from "../slice/leads.slice"
import type { LeadLifecycleStatus, LeadSource } from "../types/leads.types"

const SOURCES: LeadSource[] = [
  "meta_form",
  "whatsapp_lead_conversation",
  "whatsapp_inbound",
  "manual",
  "webinar",
]

export default function LeadsFiltersCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.leads.filters)
  const loading = useAppSelector((state) => state.leads.loading)

  useEffect(() => {
    void dispatch(fetchLeadsThunk())
  }, [dispatch, filters])

  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
        <TextField
          size="small"
          label={s.searchPlaceholder}
          value={filters.search}
          onChange={(event) => dispatch(setLeadsFiltersAct({ search: event.target.value }))}
          sx={{ minWidth: 220, flex: 1 }}
        />
        <TextField
          select
          size="small"
          label={s.lifecycleLabel}
          value={filters.lifecycleStatus}
          onChange={(event) =>
            dispatch(
              setLeadsFiltersAct({
                lifecycleStatus: event.target.value as LeadLifecycleStatus | "",
              })
            )
          }
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">{s.lifecycleAll}</MenuItem>
          <MenuItem value="lead">{s.lifecycleLead}</MenuItem>
          <MenuItem value="customer">{s.lifecycleCustomer}</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label={s.sourceLabel}
          value={filters.source}
          onChange={(event) =>
            dispatch(setLeadsFiltersAct({ source: event.target.value as LeadSource | "" }))
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">{s.sourceAll}</MenuItem>
          {SOURCES.map((source) => (
            <MenuItem key={source} value={source}>
              {s.sources[source]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          size="small"
          label="Desde"
          value={filters.from}
          onChange={(event) => dispatch(setLeadsFiltersAct({ from: event.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          size="small"
          label="Hasta"
          value={filters.to}
          onChange={(event) => dispatch(setLeadsFiltersAct({ to: event.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            disabled={loading}
            onClick={() => void dispatch(fetchLeadsThunk())}
            sx={{ cursor: "pointer" }}
          >
            {s.refresh}
          </Button>
        </Box>
      </Stack>
    </Stack>
  )
}
