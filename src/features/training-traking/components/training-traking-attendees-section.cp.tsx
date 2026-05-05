import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DownloadIcon from "@mui/icons-material/Download"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from "@mui/material"
import { useState, type MouseEvent } from "react"
import {
  TRAINING_REMINDER_TEMPLATE_OPTIONS,
  type TrainingReminderTemplateName
} from "../lib/training-reminder-templates"
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
  isSendingTrainingReminder: boolean
  onSendTrainingReminder: (
    attendee: TrainingAttendeeType,
    templateName: TrainingReminderTemplateName
  ) => Promise<void>
}

export default function TrainingTrakingAttendeesSectionCP({
  attendees,
  isTogglingCheckIn,
  isUpdatingAttendeeStatus,
  onToggleCheckIn,
  onAcceptAttendee,
  onDeclineAttendee,
  onRemoveAttendee,
  onDownloadCsv,
  isSendingTrainingReminder,
  onSendTrainingReminder
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

  const canSendWhatsappReminder = (attendee: TrainingAttendeeType): boolean => {
    const uid = attendee.userId != null ? String(attendee.userId).trim() : ""
    const phone = attendee.phoneNumber != null ? String(attendee.phoneNumber).trim() : ""
    if (uid.length === 0 || phone.length === 0) return false
    return attendee.status === "confirmed" || attendee.status === "pending"
  }

  const handlePickReminderTemplate = async (templateName: TrainingReminderTemplateName) => {
    if (actionsAttendee == null) return
    try {
      await onSendTrainingReminder(actionsAttendee, templateName)
      handleCloseAttendeeMenu()
    } catch {
      /* error handled in Redux */
    }
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
              px: 1,
              borderRadius: 1,
              backgroundColor:
                attendee.status === "confirmed" ? "success.light" : "transparent",
              transition: (theme) =>
                theme.transitions.create("background-color", {
                  duration: theme.transitions.duration.shortest
                }),
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
        <Divider />
        <Box sx={{ px: 2, py: 0.75 }}>
          <Typography variant="caption" color="text.secondary">
            Recordatorio WhatsApp
          </Typography>
        </Box>
        {TRAINING_REMINDER_TEMPLATE_OPTIONS.map((option) => (
          <MenuItem
            key={option.templateName}
            disabled={
              actionsAttendee == null ||
              !canSendWhatsappReminder(actionsAttendee) ||
              isSendingTrainingReminder ||
              isUpdatingAttendeeStatus
            }
            onClick={() => {
              void handlePickReminderTemplate(option.templateName)
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
