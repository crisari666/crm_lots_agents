import { Paper, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import LiveCallCoachErrorsCP from "./live-call-coach-errors.cp"
import LiveCallCoachNoteFormCP from "./live-call-coach-note-form.cp"
import LiveCallCoachStatusCP from "./live-call-coach-status.cp"
import LiveCallCoachVoiceControlsCP from "./live-call-coach-voice-controls.cp"

export default function LiveCallCoachPanelCP() {
  const selectedCall = useAppSelector((s) =>
    s.liveCalls.items.find((c) => c.callSid === s.liveCalls.selectedCallSid)
  )

  if (!selectedCall) return null

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Coaching — {selectedCall.from} → {selectedCall.to}
      </Typography>

      <LiveCallCoachErrorsCP />
      <LiveCallCoachStatusCP />
      <LiveCallCoachVoiceControlsCP />
      <LiveCallCoachNoteFormCP />
    </Paper>
  )
}
