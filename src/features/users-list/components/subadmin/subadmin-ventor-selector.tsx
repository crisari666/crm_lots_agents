import { useEffect, useMemo, useState } from "react"
import { Alert, Box, Button, Chip, CircularProgress, Typography } from "@mui/material"
import UserInterface from "../../../../app/models/user-interface"
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete"
import {
  getAvailableSubadminVentorsReq,
  getSubadminVentorsReq,
  setSubadminVentorsReq,
} from "../../../../app/services/users.service"
import { useAppDispatch } from "../../../../app/hooks"
import { fetchSubadminsThunk } from "../../slice/user-list.slice"

type SubadminVentorSelectorProps = {
  audit: UserInterface
  onClose: () => void
}

export default function SubadminVentorSelector({ audit, onClose }: SubadminVentorSelectorProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [relatedVentors, setRelatedVentors] = useState<UserInterface[]>([])
  const [availableVentors, setAvailableVentors] = useState<UserInterface[]>([])
  const [selectedVentors, setSelectedVentors] = useState<AppAutocompleteOption[]>([])
  const allOptions = useMemo<AppAutocompleteOption[]>(() => {
    return [...relatedVentors, ...availableVentors].map((user) => ({
      _id: String(user._id),
      name: `${user.name ?? ""} ${user.lastName ?? ""}`.trim(),
    }))
  }, [relatedVentors, availableVentors])

  const loadData = async (): Promise<void> => {
    if (!audit._id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const [related, available] = await Promise.all([
        getSubadminVentorsReq(audit._id),
        getAvailableSubadminVentorsReq(audit._id),
      ])
      setRelatedVentors(related)
      setAvailableVentors(available)
      setSelectedVentors(
        related.map((user) => ({
          _id: String(user._id),
          name: `${user.name ?? ""} ${user.lastName ?? ""}`.trim(),
        })),
      )
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [audit._id])

  const handleSave = async (): Promise<void> => {
    if (!audit._id) {
      return
    }
    setSaving(true)
    setError("")
    try {
      await setSubadminVentorsReq({
        subadminId: audit._id,
        userIds: selectedVentors.map((user) => user._id),
      })
      await dispatch(fetchSubadminsThunk())
      onClose()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  const handleChangeUsers = ({ val }: { name: string; val: AppAutocompleteOption[] }): void => {
    setSelectedVentors(val ?? [])
  }

  const handleRemoveUser = (userId: string): void => {
    setSelectedVentors((prev) => prev.filter((user) => user._id !== userId))
  }

  return (
    <Box p={1.5}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Usuarios de {audit.name} {audit.lastName}
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!loading && (
        <>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Usuarios asignados ({selectedVentors.length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {selectedVentors.length > 0 ? (
              selectedVentors.map((user) => (
                <Chip
                  key={String(user._id)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  label={user.name}
                  onDelete={() => handleRemoveUser(user._id)}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin usuarios relacionados.
              </Typography>
            )}
          </Box>
          <AppAutoComplete
            multiple={true}
            options={allOptions}
            name="ventors"
            value={selectedVentors}
            onChange={handleChangeUsers}
            label="Agregar usuarios"
            placeholder="Selecciona usuarios ventor"
          />
        </>
      )}
      {error !== "" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="flex-end" gap={1} mt={1.5}>
        <Button variant="text" size="small" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" size="small" onClick={handleSave} disabled={saving || loading}>
          Guardar
        </Button>
      </Box>
    </Box>
  )
}
