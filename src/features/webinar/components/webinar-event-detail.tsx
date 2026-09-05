import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  fetchWebinarEventByIdThunk,
  deleteWebinarEventThunk,
  selectWebinarState,
} from "../slice/webinar.slice"
import type { WebinarEventStatus } from "../types/webinar.types"
import WebinarEventFormDialog from "./webinar-event-form-dialog"
import WebinarLeadsSection from "./webinar-leads-section"

const statusLabel: Record<WebinarEventStatus, string> = {
  draft: s.statusDraft,
  active: s.statusActive,
  closed: s.statusClosed,
}

const statusColor: Record<
  WebinarEventStatus,
  "default" | "success" | "warning"
> = {
  draft: "default",
  active: "success",
  closed: "warning",
}

export default function WebinarEventDetail() {
  const dispatch = useAppDispatch()
  const {
    selectedEventId,
    selectedEvent,
    detailLoading,
    detailError,
    deletingEvent,
    deleteError,
  } = useAppSelector(selectWebinarState)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    if (selectedEventId == null) {
      return
    }
    void dispatch(fetchWebinarEventByIdThunk(selectedEventId))
  }, [dispatch, selectedEventId])

  const handleDelete = () => {
    if (selectedEvent == null) {
      return
    }
    if (!window.confirm(s.deleteConfirm)) {
      return
    }
    void dispatch(deleteWebinarEventThunk(selectedEvent.id))
  }

  if (selectedEventId == null) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography color="text.secondary" variant="body2">
            {s.selectEventHint}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (detailLoading && selectedEvent == null) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} />
        </CardContent>
      </Card>
    )
  }

  if (selectedEvent == null) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          {detailError != null ? (
            <Alert severity="error" sx={{ py: 0.5 }}>
              {detailError}
            </Alert>
          ) : (
            <Typography color="text.secondary" variant="body2">
              {s.selectEventHint}
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {selectedEvent.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedEvent.dayLabel} · {selectedEvent.dateText} · {selectedEvent.timeText}
              {" · "}
              {selectedEvent.meetLink.trim().length > 0 ? (
                <Link href={selectedEvent.meetLink} target="_blank" rel="noreferrer">
                  {s.meetOpen}
                </Link>
              ) : (
                s.meetPending
              )}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
            <Chip
              size="small"
              label={statusLabel[selectedEvent.status]}
              color={statusColor[selectedEvent.status]}
              sx={{ height: 22 }}
            />
            <Button size="small" variant="outlined" onClick={() => setIsEditOpen(true)}>
              {s.edit}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={deletingEvent}
              onClick={handleDelete}
            >
              {deletingEvent ? s.deleting : s.deleteEvent}
            </Button>
          </Stack>
        </Stack>
        {detailError != null ? (
          <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>
            {detailError}
          </Alert>
        ) : null}
        {deleteError != null ? (
          <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>
            {deleteError}
          </Alert>
        ) : null}
        <WebinarLeadsSection webinarEventId={selectedEvent.id} />
        <WebinarEventFormDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          eventToEdit={selectedEvent}
        />
      </CardContent>
    </Card>
  )
}
