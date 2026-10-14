import React, { useEffect } from "react"
import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { ChevronLeft, ChevronRight, Refresh } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import {
  addDaysToKey,
  formatDayMonth,
  getBogotaDayKey,
  getWeekStartKey,
} from "../business-logic/bogota-time"
import {
  fetchLeadCallVentorsThunk,
  fetchLeadCallsThunk,
  setLeadCallScheduleFiltersAct,
} from "../slice/lead-call-schedule.slice"
import type { LeadCallStatus } from "../types/lead-call-schedule.types"

const DAYS_PER_WEEK = 7
const WEEK_LAST_DAY_OFFSET = 6
const STATUS_OPTIONS = Object.keys(s.status) as LeadCallStatus[]

export default function LeadCallScheduleToolbarCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.leadCallSchedule.filters)
  const ventors = useAppSelector((state) => state.leadCallSchedule.ventors)
  const loading = useAppSelector((state) => state.leadCallSchedule.loading)
  const currentWeekStart = getWeekStartKey(getBogotaDayKey(new Date()))
  const weekLabel = `${formatDayMonth(filters.weekStart)} – ${formatDayMonth(addDaysToKey(filters.weekStart, WEEK_LAST_DAY_OFFSET))}`
  useEffect(() => {
    void dispatch(fetchLeadCallVentorsThunk())
    void dispatch(fetchLeadCallsThunk())
  }, [dispatch])
  const applyFilters = (patch: Parameters<typeof setLeadCallScheduleFiltersAct>[0]) => {
    dispatch(setLeadCallScheduleFiltersAct(patch))
    void dispatch(fetchLeadCallsThunk())
  }
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", md: "center" }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={s.previousWeek}>
          <IconButton
            aria-label={s.previousWeek}
            onClick={() => applyFilters({ weekStart: addDaysToKey(filters.weekStart, -DAYS_PER_WEEK) })}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" fontWeight={600} sx={{ minWidth: 150, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
          {weekLabel}
        </Typography>
        <Tooltip title={s.nextWeek}>
          <IconButton
            aria-label={s.nextWeek}
            onClick={() => applyFilters({ weekStart: addDaysToKey(filters.weekStart, DAYS_PER_WEEK) })}
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
        <Button
          size="small"
          variant="outlined"
          disabled={filters.weekStart === currentWeekStart}
          onClick={() => applyFilters({ weekStart: currentWeekStart })}
        >
          {s.today}
        </Button>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
        <TextField
          select
          size="small"
          label={s.ventorLabel}
          value={filters.userId}
          onChange={(event) => applyFilters({ userId: event.target.value })}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">{s.allVentors}</MenuItem>
          {ventors.map((ventor) => (
            <MenuItem key={ventor.id} value={ventor.id}>
              {ventor.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label={s.statusLabel}
          value={filters.status}
          onChange={(event) => applyFilters({ status: event.target.value as LeadCallStatus | "" })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">{s.allStatuses}</MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {s.status[status]}
            </MenuItem>
          ))}
        </TextField>
        <Tooltip title={s.refresh}>
          <span>
            <IconButton aria-label={s.refresh} disabled={loading} onClick={() => void dispatch(fetchLeadCallsThunk())}>
              <Refresh />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
