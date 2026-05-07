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
  const subadmins = useAppSelector((state) => state.users.audits) as UserInterface[]
  const isEditMode = trainingToEdit != null
  const initialForm = useMemo(
    () => ({
      name: trainingToEdit?.name ?? "",
      date: trainingToEdit?.date ?? "",
      time: trainingToEdit?.time ?? "",
      location: trainingToEdit?.location ?? "",
      mapsUrl: trainingToEdit?.mapsUrl ?? "",
      maxSlots: trainingToEdit?.maxSlots ?? 30,
      responsibleUserId: trainingToEdit?.responsibleUserId ?? ""
    }),
    [trainingToEdit]
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

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isEditMode && form.responsibleUserId.trim() === "") return
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
            maxSlots: form.maxSlots,
            ...(form.responsibleUserId.trim() !== ""
              ? { responsibleUserId: form.responsibleUserId.trim() }
              : {})
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
          maxSlots: form.maxSlots,
          responsibleUserId: form.responsibleUserId.trim()
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
      <DialogTitle>{isEditMode ? "Actualizar capacitación" : "Crear capacitación"}</DialogTitle>
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
                  <TextField
                    {...params}
                    label="Responsable (subadmin)"
                    required={!isEditMode}
                    helperText={
                      !isEditMode && form.responsibleUserId.trim() === ""
                        ? "Selecciona un responsable"
                        : undefined
                    }
                  />
                )}
              />
            </Grid>
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
          <Button
            type="submit"
            color="primary"
            disabled={
              isCreating ||
              isUpdatingTraining ||
              (!isEditMode && form.responsibleUserId.trim() === "")
            }
          >
            {isEditMode ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

