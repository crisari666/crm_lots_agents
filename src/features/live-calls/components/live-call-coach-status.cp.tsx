import { Chip, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { coachPhaseLabels } from "../constants/live-calls.constants"

export default function LiveCallCoachStatusCP() {
  const coachPhase = useAppSelector((s) => s.liveCalls.coachPhase)
  const conferenceName = useAppSelector((s) => s.liveCalls.coachSession?.conferenceName)

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Chip
        size="small"
        label={coachPhaseLabels[coachPhase] ?? coachPhase}
        color={coachPhase === "open" ? "success" : coachPhase === "error" ? "error" : "default"}
      />
      {conferenceName ? (
        <Typography variant="caption" color="text.secondary">
          Conferencia: {conferenceName}
        </Typography>
      ) : null}
    </Stack>
  )
}
