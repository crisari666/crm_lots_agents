import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DownloadIcon from "@mui/icons-material/Download"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from "@mui/material"
import { useState, type MouseEvent } from "react"
import type { TrainingAttendeeType } from "../types/training-traking.types"

type TrainingTrakingAttendeesSectionCPProps = {
  attendees: TrainingAttendeeType[]
  isTogglingCheckIn: boolean
  isUpdatingAttendeeStatus: boolean
  onToggleCheckIn: (attendee: TrainingAttendeeType) => void
  onAcceptAttendee: (attendee: TrainingAttendeeType) => void
  onDeclineAttendee: (attendee: TrainingAttendeeType) => void
  onRemoveAttendee: (attendee: TrainingAttendeeType) => void
  onDownloadCsv: () => void
}

export default function TrainingTrakingAttendeesSectionCP({
  attendees,
  isTogglingCheckIn,
  isUpdatingAttendeeStatus,
  onToggleCheckIn,
  onAcceptAttendee,
  onDeclineAttendee,
  onRemoveAttendee,
  onDownloadCsv
}: TrainingTrakingAttendeesSectionCPProps) {
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null)
  const [actionsAttendee, setActionsAttendee] = useState<TrainingAttendeeType | null>(null)

  const handleOpenAttendeeMenu = (
    event: MouseEvent<HTMLElement>,
    attendee: TrainingAttendeeType
  ) => {
    setActionsAnchorEl(event.currentTarget)
    setActionsAttendee(attendee)
  }

  const handleCloseAttendeeMenu = () => {
    setActionsAnchorEl(null)
    setActionsAttendee(null)
  }

  const handleRemoveAttendee = () => {
    if (actionsAttendee == null) return
    const shouldRemove = window.confirm("¿Remover este usuario de la capacitación?")
    if (!shouldRemove) return
    onRemoveAttendee(actionsAttendee)
    handleCloseAttendeeMenu()
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1
        }}
      >
        <Typography variant="subtitle2">Asistentes</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onDownloadCsv}
          disabled={attendees.length === 0}
        >
          Descargar CSV
        </Button>
      </Box>

      {attendees.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay inscritos aún.
        </Typography>
      ) : (
        attendees.map((attendee) => (
          <Box
            key={attendee.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider"
            }}
          >
            <Box>
              <Typography variant="body2">{attendee.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {attendee.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip label={attendee.status} size="small" />
              <Tooltip title="Acciones">
                <IconButton size="small" onClick={(event) => handleOpenAttendeeMenu(event, attendee)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                color={attendee.checkedIn ? "success" : "default"}
                onClick={() => onToggleCheckIn(attendee)}
                disabled={attendee.status !== "confirmed" || isTogglingCheckIn || isUpdatingAttendeeStatus}
              >
                {attendee.checkedIn ? (
                  <CheckCircleIcon fontSize="small" />
                ) : (
                  <RadioButtonUncheckedIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
        ))
      )}
      <Menu anchorEl={actionsAnchorEl} open={actionsAnchorEl != null} onClose={handleCloseAttendeeMenu}>
        <MenuItem
          disabled={
            actionsAttendee == null || actionsAttendee.status !== "pending" || isUpdatingAttendeeStatus
          }
          onClick={() => {
            if (actionsAttendee != null) {
              onAcceptAttendee(actionsAttendee)
            }
            handleCloseAttendeeMenu()
          }}
        >
          Confirmar
        </MenuItem>
        <MenuItem
          disabled={
            actionsAttendee == null || actionsAttendee.status !== "pending" || isUpdatingAttendeeStatus
          }
          onClick={() => {
            if (actionsAttendee != null) {
              onDeclineAttendee(actionsAttendee)
            }
            handleCloseAttendeeMenu()
          }}
        >
          Rechazar
        </MenuItem>
        <MenuItem disabled={actionsAttendee == null || isUpdatingAttendeeStatus} onClick={handleRemoveAttendee}>
          Remover de capacitación
        </MenuItem>
      </Menu>
    </Box>
  )
}
