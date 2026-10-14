import React from "react"
import { Button, MenuItem, Paper, Stack, TextField } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import {
  fetchLeadConversationsThunk,
  setLeadConversationsFiltersAct,
} from "../slice/lead-conversations.slice"
import type { LeadConversationStatus, LeadConversationStep } from "../types/lead-conversations.types"

const STATUS_OPTIONS = Object.keys(s.status) as LeadConversationStatus[]
const STEP_OPTIONS = Object.keys(s.step) as LeadConversationStep[]

export default function LeadConversationsFiltersCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.leadConversations.filters)
  const loading = useAppSelector((state) => state.leadConversations.loading)
  const applyFilters = (patch: Parameters<typeof setLeadConversationsFiltersAct>[0]) => {
    dispatch(setLeadConversationsFiltersAct({ ...patch, page: 0 }))
    void dispatch(fetchLeadConversationsThunk())
  }
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    applyFilters({})
  }
  return (
    <Paper component="form" onSubmit={onSubmit} variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <TextField
          size="small"
          label={s.searchLabel}
          value={filters.search}
          onChange={(event) => dispatch(setLeadConversationsFiltersAct({ search: event.target.value }))}
          sx={{ flex: 1, minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          label={s.statusLabel}
          value={filters.status}
          onChange={(event) => applyFilters({ status: event.target.value as LeadConversationStatus | "" })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">{s.allOption}</MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {s.status[status]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label={s.stepLabel}
          value={filters.step}
          onChange={(event) => applyFilters({ step: event.target.value as LeadConversationStep | "" })}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{s.allOption}</MenuItem>
          {STEP_OPTIONS.map((step) => (
            <MenuItem key={step} value={step}>
              {s.step[step]}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>
          {s.searchButton}
        </Button>
      </Stack>
    </Paper>
  )
}
