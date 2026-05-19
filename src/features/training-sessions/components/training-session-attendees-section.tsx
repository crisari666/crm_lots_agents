import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addTrainingSessionAttendeeThunk,
  removeTrainingSessionAttendeeThunk,
  selectTrainingSessionsState
} from "../slice/training-sessions.slice"
import UserAutocompleteAsync from "./user-autocomplete-async"
import type { TrainingSessionUserSearchItem } from "../types/training-sessions.types"

type TrainingSessionAttendeesSectionProps = {
  sessionId: string
}

export default function TrainingSessionAttendeesSection({
  sessionId
}: TrainingSessionAttendeesSectionProps) {
  const dispatch = useAppDispatch()
  const { detail, isAddingAttendee, isRemovingAttendee } = useAppSelector(selectTrainingSessionsState)
  const [selectedUser, setSelectedUser] = useState<TrainingSessionUserSearchItem | null>(null)
  const [emailInput, setEmailInput] = useState("")

  if (detail == null) return null

  const handleAddByUser = async () => {
    if (selectedUser == null) return
    await dispatch(
      addTrainingSessionAttendeeThunk({ sessionId, userId: selectedUser.id })
    )
    setSelectedUser(null)
  }

  const handleAddByEmail = async () => {
    const email = emailInput.trim()
    if (email.length === 0) return
    await dispatch(addTrainingSessionAttendeeThunk({ sessionId, email }))
    setEmailInput("")
  }

  const handleRemove = async (attendeeId: string) => {
    await dispatch(removeTrainingSessionAttendeeThunk({ sessionId, attendeeId }))
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Asistentes ({detail.attendees.length})
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <UserAutocompleteAsync
              value={selectedUser}
              onChange={setSelectedUser}
              disabled={isAddingAttendee}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => void handleAddByUser()}
            disabled={selectedUser == null || isAddingAttendee}
            sx={{ cursor: "pointer" }}
          >
            Agregar
          </Button>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            size="small"
            fullWidth
            label="Correo del usuario"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isAddingAttendee}
          />
          <Button
            variant="outlined"
            onClick={() => void handleAddByEmail()}
            disabled={emailInput.trim().length === 0 || isAddingAttendee}
            sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Agregar por email
          </Button>
        </Stack>
      </Stack>
      {detail.attendees.map((attendee) => (
        <Box
          key={attendee.id}
          sx={{
            display: "flex",
            alignItems: "center",
            py: 1,
            borderBottom: 1,
            borderColor: "divider"
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2">{attendee.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {attendee.email}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => void handleRemove(attendee.id)}
            disabled={isRemovingAttendee}
            aria-label="Quitar asistente"
            sx={{ cursor: "pointer" }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      {detail.attendees.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Sin asistentes registrados.
        </Typography>
      ) : null}
    </Box>
  )
}
