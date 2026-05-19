import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchSubadminsThunk } from "../../users-list/slice/user-list.slice"
import {
  createTrainingSessionThunk,
  selectTrainingSessionsState,
  updateTrainingSessionThunk
} from "../slice/training-sessions.slice"
import type { TrainingSessionDetailType } from "../types/training-sessions.types"

type TrainingSessionsFormDialogProps = {
  open: boolean
  onClose: () => void
  sessionToEdit?: TrainingSessionDetailType | null
}

export default function TrainingSessionsFormDialog({
  open,
  onClose,
  sessionToEdit = null
}: TrainingSessionsFormDialogProps) {
  const dispatch = useAppDispatch()
  const { isCreating, isUpdating } = useAppSelector(selectTrainingSessionsState)
  const subadmins = useAppSelector((state) => state.users.audits) as UserInterface[]
  const isEditMode = sessionToEdit != null
  const initialForm = useMemo(
    () => ({
      name: sessionToEdit?.name ?? "",
      date: sessionToEdit?.date ?? "",
      time: sessionToEdit?.time ?? "",
      location: sessionToEdit?.location ?? "",
      mapsUrl: sessionToEdit?.mapsUrl ?? "",
      responsibleUserId: sessionToEdit?.responsibleUserId ?? ""
    }),
    [sessionToEdit]
  )
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (!open) return
    setForm(initialForm)
  }, [initialForm, open])

  useEffect(() => {
    if (!open || subadmins.length > 0) return
    void dispatch(fetchSubadminsThunk())
  }, [dispatch, open, subadmins.length])

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isEditMode && sessionToEdit != null) {
      await dispatch(
        updateTrainingSessionThunk({
          id: sessionToEdit.id,
          payload: {
            name: form.name,
            date: form.date,
            time: form.time,
            location: form.location,
            mapsUrl: form.mapsUrl || undefined,
            ...(form.responsibleUserId.trim() !== ""
              ? { responsibleUserId: form.responsibleUserId.trim() }
              : {})
          }
        })
      )
    } else {
      await dispatch(
        createTrainingSessionThunk({
          name: form.name,
          date: form.date,
          time: form.time,
          location: form.location,
          mapsUrl: form.mapsUrl || undefined,
          ...(form.responsibleUserId.trim() !== ""
            ? { responsibleUserId: form.responsibleUserId.trim() }
            : {})
        })
      )
    }
    onClose()
  }

  const selectedSubadmin: UserInterface | null =
    form.responsibleUserId.trim() === ""
      ? null
      : subadmins.find((u) => u._id === form.responsibleUserId) ?? null

  const subadminOptionLabel = (user: UserInterface): string => {
    const full = `${user.name ?? ""} ${user.lastName ?? ""}`.trim()
    return full.length > 0 ? `${full} · ${user.email}` : user.email
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Actualizar sesión" : "Nueva sesión de entrenamiento"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={subadmins}
                isOptionEqualToValue={(option, value) =>
                  value == null ? false : option._id === value._id
                }
                getOptionLabel={(option) => subadminOptionLabel(option)}
                value={selectedSubadmin}
                onChange={(_, value) =>
                  handleChange("responsibleUserId", value?._id != null ? String(value._id) : "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Responsable (subadmin)" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Hora"
                type="time"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ubicación"
                fullWidth
                required
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enlace de Google Maps"
                fullWidth
                value={form.mapsUrl}
                onChange={(e) => handleChange("mapsUrl", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" color="primary" disabled={isCreating || isUpdating}>
            {isEditMode ? "Guardar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
