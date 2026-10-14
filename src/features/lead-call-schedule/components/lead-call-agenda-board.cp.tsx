import React from "react"
import { Alert, Box, Button, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material"
import { EventAvailableOutlined } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { fetchLeadCallsThunk } from "../slice/lead-call-schedule.slice"
import LeadCallAgendaGridCP from "./lead-call-agenda-grid.cp"
import LeadCallDayListCP from "./lead-call-day-list.cp"

const SKELETON_ROWS = 6

function AgendaSkeleton(): React.ReactElement {
  return (
    <Stack spacing={1} aria-busy="true">
      {Array.from({ length: SKELETON_ROWS }, (_unused, index) => (
        <Skeleton key={index} variant="rounded" height={44} />
      ))}
    </Stack>
  )
}

function AgendaEmpty(): React.ReactElement {
  return (
    <Box sx={{ py: 6, px: 2, textAlign: "center", maxWidth: 520, mx: "auto" }}>
      <EventAvailableOutlined sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
      <Typography variant="subtitle1" fontWeight={600}>
        {s.emptyTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {s.emptyHint}
      </Typography>
    </Box>
  )
}

/** Loading / error / empty states around the responsive agenda. */
export default function LeadCallAgendaBoardCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))
  const loading = useAppSelector((state) => state.leadCallSchedule.loading)
  const error = useAppSelector((state) => state.leadCallSchedule.error)
  const isEmpty = useAppSelector((state) => state.leadCallSchedule.items.length === 0)
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => void dispatch(fetchLeadCallsThunk())}>
            {s.retry}
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }
  if (loading && isEmpty) return <AgendaSkeleton />
  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, transition: "opacity 200ms ease" }}>
      {isEmpty ? <AgendaEmpty /> : null}
      {!isEmpty && isDesktop ? <LeadCallAgendaGridCP /> : null}
      {!isEmpty && !isDesktop ? <LeadCallDayListCP /> : null}
    </Box>
  )
}
