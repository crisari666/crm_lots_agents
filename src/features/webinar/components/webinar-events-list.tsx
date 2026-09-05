import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  fetchWebinarEventsThunk,
  selectWebinarState,
  setSelectedWebinarEventId,
} from "../slice/webinar.slice"
import type { WebinarEventStatus, WebinarEventsListFilter } from "../types/webinar.types"

const statusColor: Record<
  WebinarEventStatus,
  "default" | "success" | "warning"
> = {
  draft: "default",
  active: "success",
  closed: "warning",
}

const statusLabel: Record<WebinarEventStatus, string> = {
  draft: s.statusDraft,
  active: s.statusActive,
  closed: s.statusClosed,
}

type WebinarEventsListProps = {
  readonly filter: WebinarEventsListFilter
}

export default function WebinarEventsList({ filter }: WebinarEventsListProps) {
  const dispatch = useAppDispatch()
  const { events, eventsLoading, eventsError, selectedEventId } =
    useAppSelector(selectWebinarState)

  useEffect(() => {
    void dispatch(fetchWebinarEventsThunk())
  }, [dispatch])

  const filteredEvents =
    filter === "all" ? events : events.filter((event) => event.status === filter)

  return (
    <Card variant="outlined" sx={{ maxHeight: { md: "calc(100vh - 160px)" }, overflow: "auto" }}>
      <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {s.eventsListTitle}
          </Typography>
          {eventsLoading ? <CircularProgress size={16} /> : null}
        </Box>
        {eventsError != null ? (
          <Typography color="error" variant="caption" display="block" sx={{ mb: 0.75 }}>
            {eventsError}
          </Typography>
        ) : null}
        {filteredEvents.length === 0 && !eventsLoading ? (
          <Typography color="text.secondary" variant="body2">
            {s.noEvents}
          </Typography>
        ) : null}
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            onClick={() => dispatch(setSelectedWebinarEventId(event.id))}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.75,
              mb: 0.5,
              borderRadius: 1,
              bgcolor:
                event.id === selectedEventId
                  ? "action.selected"
                  : "transparent",
              "&:hover": {
                bgcolor: "action.hover",
                cursor: "pointer",
              },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {event.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {event.dayLabel} · {event.dateText} · {event.timeText}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={statusLabel[event.status]}
              color={statusColor[event.status]}
              sx={{ height: 22, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
