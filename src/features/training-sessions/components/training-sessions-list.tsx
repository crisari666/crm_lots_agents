import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TablePagination,
  Typography
} from "@mui/material"
import { useEffect } from "react"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { dateToInputDate } from "../../../utils/date.utils"
import {
  fetchTrainingSessionsThunk,
  selectTrainingSessionsState,
  setSelectedTrainingSessionId
} from "../slice/training-sessions.slice"

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const

export default function TrainingSessionsList() {
  const dispatch = useAppDispatch()
  const { list, isLoadingList, selectedId, page, limit, total } =
    useAppSelector(selectTrainingSessionsState)

  useEffect(() => {
    void dispatch(fetchTrainingSessionsThunk({ page, limit }))
  }, [dispatch, page, limit])

  const handlePageChange = (_event: unknown, newPage: number) => {
    void dispatch(fetchTrainingSessionsThunk({ page: newPage, limit }))
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(event.target.value)
    void dispatch(fetchTrainingSessionsThunk({ page: 0, limit: newLimit }))
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Sesiones</Typography>
          {isLoadingList ? <CircularProgress size={20} /> : null}
        </Box>
        {list.map((session) => (
          <Box
            key={session.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              mb: 1,
              borderRadius: 1,
              bgcolor: session.id === selectedId ? "action.selected" : "background.paper",
              "&:hover": { bgcolor: "action.hover", cursor: "pointer" }
            }}
            onClick={() => dispatch(setSelectedTrainingSessionId(session.id))}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {session.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dateToInputDate(session.date)} · {session.time} · {session.attendeeCount} asistentes
              </Typography>
            </Box>
            <IconButton size="small">
              <ArrowForwardIosIcon fontSize="inherit" />
            </IconButton>
          </Box>
        ))}
        {!isLoadingList && list.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay sesiones registradas.
          </Typography>
        ) : null}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[...PAGE_SIZE_OPTIONS]}
          labelRowsPerPage="Por página"
        />
      </CardContent>
    </Card>
  )
}
