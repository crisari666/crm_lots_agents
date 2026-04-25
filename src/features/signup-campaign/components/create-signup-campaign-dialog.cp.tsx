import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  createSignupCampaignThunk,
  fetchSignupCampaignsThunk,
  resetCreateSignupCampaignStatusAct,
  selectCreateSignupCampaignError,
  selectCreateSignupCampaignStatus,
} from "../slice/signup-campaign.slice"

const initialForm = {
  name: "",
  description: "",
  dateStart: "",
  dateEnd: "",
}

type FormErrors = Partial<Record<keyof typeof initialForm, string>>

function validate(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {}
  if (form.name.trim() === "") {
    errors.name = "El nombre es obligatorio"
  }
  if (form.dateStart.trim() === "") {
    errors.dateStart = "Selecciona la fecha de inicio"
  }
  if (form.dateEnd.trim() === "") {
    errors.dateEnd = "Selecciona la fecha de fin"
  }
  if (
    errors.dateStart === undefined &&
    errors.dateEnd === undefined &&
    new Date(form.dateEnd).getTime() <= new Date(form.dateStart).getTime()
  ) {
    errors.dateEnd = "La fecha de fin debe ser posterior al inicio"
  }
  return errors
}

interface CreateSignupCampaignDialogProps {
  readonly open: boolean
  readonly onClose: () => void
}

export default function CreateSignupCampaignDialog({
  open,
  onClose,
}: CreateSignupCampaignDialogProps) {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCreateSignupCampaignStatus)
  const errorMessage = useAppSelector(selectCreateSignupCampaignError)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const isSubmitting = status === "submitting"
  useEffect(() => {
    if (status === "success") {
      setForm(initialForm)
      setErrors({})
      dispatch(resetCreateSignupCampaignStatusAct())
      void dispatch(fetchSignupCampaignsThunk())
      onClose()
    }
  }, [status, dispatch, onClose])
  useEffect(() => {
    if (!open) {
      setForm(initialForm)
      setErrors({})
      dispatch(resetCreateSignupCampaignStatusAct())
    }
  }, [open, dispatch])
  const handleSubmit = () => {
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    void dispatch(
      createSignupCampaignThunk({
        name: form.name.trim(),
        description: form.description.trim(),
        dateStart: new Date(form.dateStart).toISOString(),
        dateEnd: new Date(form.dateEnd).toISOString(),
      }),
    )
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear campaña de registro</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            error={errors.name !== undefined}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Descripción (opcional)"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            multiline
            minRows={2}
            fullWidth
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Inicio"
              type="datetime-local"
              value={form.dateStart}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dateStart: e.target.value }))
              }
              error={errors.dateStart !== undefined}
              helperText={errors.dateStart}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Fin"
              type="datetime-local"
              value={form.dateEnd}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dateEnd: e.target.value }))
              }
              error={errors.dateEnd !== undefined}
              helperText={errors.dateEnd}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
          {errorMessage != null && errorMessage !== "" ? (
            <Alert severity="error">{errorMessage}</Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
        >
          Crear campaña
        </Button>
      </DialogActions>
    </Dialog>
  )
}
