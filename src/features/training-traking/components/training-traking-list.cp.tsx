import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography
} from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  fetchTrainingsThunk,
  selectTrainingTrakingList,
  selectTrainingTrakingState,
  setSelectedTrainingId
} from "../slice/training-traking.slice"
import { dateToInputDate } from "../../../utils/date.utils"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

export default function TrainingTrakingListCP() {
  const dispatch = useAppDispatch()
  const list = useAppSelector(selectTrainingTrakingList)
  const { isLoadingList, selectedId } = useAppSelector(selectTrainingTrakingState)

  useEffect(() => {
    dispatch(fetchTrainingsThunk())
  }, [dispatch])

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2
          }}
        >
          <Typography variant="h6">Capacitaciones</Typography>
          {isLoadingList ? <CircularProgress size={20} /> : null}
        </Box>

        {list.map((training) => {
          const confirmed = training.attendeeCounts.confirmed
          const fillPercent = (confirmed / training.maxSlots) * 100
          const isNearFull = fillPercent >= 90

          return (
            <Box
              key={training.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                bgcolor: training.id === selectedId ? "action.selected" : "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                  cursor: "pointer"
                }
              }}
              onClick={() => dispatch(setSelectedTrainingId(training.id))}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {training.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dateToInputDate(training.date)} · {training.time} · {training.location}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "action.disabledBackground",
                    overflow: "hidden"
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${Math.min(fillPercent, 100)}%`,
                      bgcolor: isNearFull ? "warning.main" : "primary.main"
                    }}
                  />
                </Box>
              </Box>
              <IconButton size="small">
                <ArrowForwardIosIcon fontSize="inherit" />
              </IconButton>
            </Box>
          )
        })}

        {!isLoadingList && list.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay capacitaciones creadas.
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  )
}

