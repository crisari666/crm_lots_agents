import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  createTrainingThunk,
  selectTrainingTrakingState,
  updateTrainingThunk
} from "../slice/training-traking.slice"
import type { TrainingDetailType } from "../types/training-traking.types"

type TrainingTrakingCreateDialogCPProps = {
  open: boolean
  onClose: () => void
  trainingToEdit?: TrainingDetailType | null
}

export default function TrainingTrakingCreateDialogCP({
  open,
  onClose,
  trainingToEdit = null
}: TrainingTrakingCreateDialogCPProps) {
  const dispatch = useAppDispatch()
  const { isCreating, isUpdatingTraining } = useAppSelector(selectTrainingTrakingState)
  const isEditMode = trainingToEdit != null
  const initialForm = useMemo(
    () => ({
      name: trainingToEdit?.name ?? "",
      date: trainingToEdit?.date ?? "",
      time: trainingToEdit?.time ?? "",
      location: trainingToEdit?.location ?? "",
      mapsUrl: trainingToEdit?.mapsUrl ?? "",
      maxSlots: trainingToEdit?.maxSlots ?? 30
    }),
    [trainingToEdit]
  )
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (!open) return
    setForm(initialForm)
  }, [initialForm, open])

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isEditMode && trainingToEdit != null) {
      await dispatch(
        updateTrainingThunk({
          id: trainingToEdit.id,
          payload: {
            name: form.name,
            date: form.date,
            time: form.time,
            location: form.location,
            mapsUrl: form.mapsUrl,
            maxSlots: form.maxSlots
          }
        })
      )
    } else {
      await dispatch(
        createTrainingThunk({
          name: form.name,
          date: form.date,
          time: form.time,
          location: form.location,
          mapsUrl: form.mapsUrl,
          maxSlots: form.maxSlots
        })
      )
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Actualizar capacitación" : "Crear capacitación"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la capacitación"
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
            <Grid item xs={6}>
              <TextField
                label="Cupos disponibles"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
                value={form.maxSlots}
                onChange={(e) =>
                  handleChange("maxSlots", Number.isNaN(Number(e.target.value)) ? 1 : Number(e.target.value))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" color="primary" disabled={isCreating || isUpdatingTraining}>
            {isEditMode ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

