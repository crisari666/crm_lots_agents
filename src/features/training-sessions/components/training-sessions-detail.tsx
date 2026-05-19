import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Typography
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { dateToInputDate } from "../../../utils/date.utils"
import {
  fetchTrainingSessionDetailThunk,
  selectTrainingSessionsState
} from "../slice/training-sessions.slice"
import TrainingSessionsFormDialog from "./training-sessions-form-dialog"
import TrainingSessionAttendeesSection from "./training-session-attendees-section"

export default function TrainingSessionsDetail() {
  const dispatch = useAppDispatch()
  const { selectedId, detail, isLoadingDetail } = useAppSelector(selectTrainingSessionsState)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    if (selectedId == null) return
    void dispatch(fetchTrainingSessionDetailThunk(selectedId))
  }, [dispatch, selectedId])

  if (selectedId == null) {
    return (
      <Card sx={{ minHeight: 320 }}>
        <CardContent>
          <Typography color="text.secondary">Selecciona una sesión para ver el detalle.</Typography>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingDetail && detail == null) {
    return (
      <Card sx={{ minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    )
  }

  if (detail == null) {
    return (
      <Card sx={{ minHeight: 320 }}>
        <CardContent>
          <Typography color="text.secondary">No se pudo cargar la sesión.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography variant="h6">{detail.name}</Typography>
            <Button
              startIcon={<EditIcon />}
              size="small"
              onClick={() => setIsEditOpen(true)}
              sx={{ cursor: "pointer" }}
            >
              Editar
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {dateToInputDate(detail.date)} · {detail.time}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {detail.location}
          </Typography>
          {detail.mapsUrl ? (
            <Link href={detail.mapsUrl} target="_blank" rel="noopener noreferrer" variant="body2">
              Ver en mapa
            </Link>
          ) : null}
          {detail.googleMeetUrl ? (
            <Box sx={{ mt: 1 }}>
              <Link href={detail.googleMeetUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                Google Meet
              </Link>
            </Box>
          ) : null}
          <TrainingSessionAttendeesSection sessionId={detail.id} />
        </CardContent>
      </Card>
      <TrainingSessionsFormDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        sessionToEdit={detail}
      />
    </>
  )
}
