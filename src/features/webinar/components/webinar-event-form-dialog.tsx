import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  clearWebinarFormError,
  createWebinarEventThunk,
  selectWebinarState,
  updateWebinarEventThunk,
} from "../slice/webinar.slice"
import type {
  WebinarEvent,
  WebinarEventFormState,
  WebinarEventStatus,
} from "../types/webinar.types"
import {
  bogotaDatetimeLocalToIso,
  formatWebinarTemplatePreview,
  isoToBogotaDatetimeLocal,
} from "../utils/webinar-bogota-datetime"

type WebinarEventFormDialogProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly eventToEdit?: WebinarEvent | null
}

export default function WebinarEventFormDialog({
  open,
  onClose,
  eventToEdit = null,
}: WebinarEventFormDialogProps) {
  const dispatch = useAppDispatch()
  const { formSubmitting, formError } = useAppSelector(selectWebinarState)
  const isEditMode = eventToEdit != null
  const initialForm = useMemo<WebinarEventFormState>(
    () => ({
      name: eventToEdit?.name ?? "",
      status: eventToEdit?.status ?? "draft",
      scheduledAt: isoToBogotaDatetimeLocal(eventToEdit?.scheduledAt),
    }),
    [eventToEdit]
  )
  const [form, setForm] = useState<WebinarEventFormState>(initialForm)

  useEffect(() => {
    if (!open) {
      return
    }
    setForm(initialForm)
    dispatch(clearWebinarFormError())
  }, [dispatch, initialForm, open])

  const preview = useMemo(() => {
    const iso = bogotaDatetimeLocalToIso(form.scheduledAt)
    if (iso == null) {
      return { dayLabel: "", dateText: "", timeText: "" }
    }
    return formatWebinarTemplatePreview(new Date(iso))
  }, [form.scheduledAt])

  const handleChange = <K extends keyof WebinarEventFormState>(
    key: K,
    value: WebinarEventFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const scheduledAt = bogotaDatetimeLocalToIso(form.scheduledAt)
    if (scheduledAt == null) {
      return
    }
    if (isEditMode && eventToEdit != null) {
      const result = await dispatch(
        updateWebinarEventThunk({
          eventId: eventToEdit.id,
          body: {
            name: form.name.trim(),
            status: form.status,
            scheduledAt,
          },
        })
      )
      if (updateWebinarEventThunk.fulfilled.match(result)) {
        onClose()
      }
      return
    }
    const result = await dispatch(
      createWebinarEventThunk({
        name: form.name.trim(),
        status: form.status,
        scheduledAt,
      })
    )
    if (createWebinarEventThunk.fulfilled.match(result)) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? s.editEvent : s.newEvent}</DialogTitle>
        <DialogContent>
          {formError != null ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          ) : null}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label={s.fieldName}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={s.fieldScheduledAt}
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => handleChange("scheduledAt", e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                helperText={s.scheduledAtTimezoneHint}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="webinar-event-status">{s.fieldStatus}</InputLabel>
                <Select
                  labelId="webinar-event-status"
                  label={s.fieldStatus}
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as WebinarEventStatus)
                  }
                >
                  <MenuItem value="draft">{s.statusDraft}</MenuItem>
                  <MenuItem value="active">{s.statusActive}</MenuItem>
                  <MenuItem value="closed">{s.statusClosed}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {s.templatePreviewTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.fieldDayLabel}: {preview.dayLabel || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.fieldDateText}: {preview.dateText || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.fieldTimeText}: {preview.timeText || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {s.meetAutoCreateHint}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={formSubmitting}>
            {s.cancel}
          </Button>
          <Button type="submit" variant="contained" disabled={formSubmitting}>
            {s.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
