import { Button, Stack } from "@mui/material"
import {
  HeadsetMic as HeadsetMicIcon,
  HeadsetOff as HeadsetOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  joinCoachCallThunk,
  leaveCoachCallThunk,
  setCoachMutedState,
} from "../redux/live-calls.slice"

export default function LiveCallCoachVoiceControlsCP() {
  const dispatch = useAppDispatch()
  const selectedCallSid = useAppSelector((s) => s.liveCalls.selectedCallSid)
  const coachPhase = useAppSelector((s) => s.liveCalls.coachPhase)
  const coachMuted = useAppSelector((s) => s.liveCalls.coachMuted)
  const supervisorUserId = useAppSelector((s) => s.login.currentUser?._id ?? "")

  const isCoaching = coachPhase === "open" || coachPhase === "connecting"

  if (!selectedCallSid) return null

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
      {!isCoaching ? (
        <Button
          variant="contained"
          startIcon={<HeadsetMicIcon />}
          onClick={() =>
            void dispatch(
              joinCoachCallThunk({
                callSid: selectedCallSid,
                supervisorUserId,
              })
            )
          }
          disabled={!supervisorUserId}
        >
          Unirse como coach
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            color="error"
            startIcon={<HeadsetOffIcon />}
            onClick={() => void dispatch(leaveCoachCallThunk())}
          >
            Salir del coach
          </Button>
          <Button
            variant="outlined"
            startIcon={coachMuted ? <MicOffIcon /> : <MicIcon />}
            onClick={() => dispatch(setCoachMutedState(!coachMuted))}
          >
            {coachMuted ? "Activar micrófono" : "Silenciar micrófono"}
          </Button>
        </>
      )}
    </Stack>
  )
}
