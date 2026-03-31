import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Typography
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  fetchTrainingDetailThunk,
  selectTrainingTrakingDetail,
  selectTrainingTrakingState
} from "../slice/training-traking.slice"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DownloadIcon from "@mui/icons-material/Download"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import type { TrainingAttendeeType } from "../types/training-traking.types"
import { toggleCheckInThunk } from "../slice/training-traking.slice"

export default function TrainingTrakingDetailCP() {
  const dispatch = useAppDispatch()
  const detail = useAppSelector(selectTrainingTrakingDetail)
  const { selectedId, isLoadingDetail } = useAppSelector(selectTrainingTrakingState)

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchTrainingDetailThunk(selectedId))
    }
  }, [dispatch, selectedId])

  if (!selectedId) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Selecciona una capacitación para ver el detalle.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingDetail || !detail) {
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  const confirmed = detail.attendees.filter((a) => a.status === "confirmed").length
  const declined = detail.attendees.filter((a) => a.status === "declined").length
  const pending = detail.attendees.filter((a) => a.status === "pending").length

  const handleToggleCheckIn = (attendee: TrainingAttendeeType) => {
    if (attendee.status !== "confirmed") return
    dispatch(
      toggleCheckInThunk({
        trainingId: detail.id,
        attendeeId: attendee.id
      })
    )
  }

  const escapeCsvValue = (value: string) => `"${value.replace(/"/g, `""`)}"`

  const handleDownloadAttendeesCsv = () => {
    const header = ["name", "phone", "email", "status"]
    const rows = detail.attendees.map((attendee) => [
      attendee.name ?? "",
      attendee.phoneNumber ?? "",
      attendee.email ?? "",
      attendee.status ?? ""
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const safeTrainingName = detail.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    link.href = url
    link.download = `${safeTrainingName || "training"}-attendees.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {detail.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {detail.date} · {detail.time} · {detail.location}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mt: 2
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.08)
            }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 700,
                color: "success.main",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.2
              }}
            >
              {confirmed}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Confirmados
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
            }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 700,
                color: "error.main",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.2
              }}
            >
              {declined}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              No asisten
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
              bgcolor: "action.hover"
            }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.2
              }}
            >
              {pending}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Pendientes
            </Typography>
          </Box>
        </Box>

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
              onClick={handleDownloadAttendeesCsv}
              disabled={detail.attendees.length === 0}
            >
              Descargar CSV
            </Button>
          </Box>

          {detail.attendees.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay inscritos aún.
            </Typography>
          ) : (
            detail.attendees.map((attendee) => (
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
                  <IconButton
                    size="small"
                    color={attendee.checkedIn ? "success" : "default"}
                    onClick={() => handleToggleCheckIn(attendee)}
                    disabled={attendee.status !== "confirmed"}
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
        </Box>
      </CardContent>
    </Card>
  )
}

