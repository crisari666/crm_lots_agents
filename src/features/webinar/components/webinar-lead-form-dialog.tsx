import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  clearWebinarLeadFormError,
  createWebinarLeadThunk,
  selectWebinarState,
} from "../slice/webinar.slice"
import type { WebinarLeadFormState } from "../types/webinar.types"

const emptyForm: WebinarLeadFormState = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
}

type WebinarLeadFormDialogProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly webinarEventId: string
}

export default function WebinarLeadFormDialog({
  open,
  onClose,
  webinarEventId,
}: WebinarLeadFormDialogProps) {
  const dispatch = useAppDispatch()
  const { leadFormSubmitting, leadFormError } = useAppSelector(selectWebinarState)
  const [form, setForm] = useState<WebinarLeadFormState>(emptyForm)

  useEffect(() => {
    if (!open) {
      return
    }
    setForm(emptyForm)
    dispatch(clearWebinarLeadFormError())
  }, [dispatch, open])

  const handleChange = <K extends keyof WebinarLeadFormState>(
    key: K,
    value: WebinarLeadFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const canSubmit =
    form.name.trim().length > 0 && form.phone.trim().length >= 7 && !leadFormSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) {
      return
    }
    const result = await dispatch(
      createWebinarLeadThunk({
        webinarEventId,
        name: form.name.trim(),
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        sendNotification: true,
      })
    )
    if (createWebinarLeadThunk.fulfilled.match(result)) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{s.addLeadTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {s.addLeadHint}
        </Typography>
        {leadFormError != null ? (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {leadFormError}
          </Alert>
        ) : null}
        <Stack spacing={1.5} sx={{ mt: 0.5 }}>
          <TextField
            size="small"
            label={s.fieldName}
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
            autoFocus
            fullWidth
          />
          <TextField
            size="small"
            label={s.fieldLastName}
            value={form.lastName}
            onChange={(event) => handleChange("lastName", event.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label={s.fieldPhone}
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            required
            fullWidth
            helperText={s.fieldPhoneHint}
          />
          <TextField
            size="small"
            label={s.fieldEmail}
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 1.5 }}>
        <Button size="small" onClick={onClose} disabled={leadFormSubmitting}>
          {s.cancel}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit}
        >
          {leadFormSubmitting ? s.savingLead : s.addLead}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
