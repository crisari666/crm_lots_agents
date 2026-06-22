import { Alert } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearCoachErrors } from "../redux/live-calls.slice"

export default function LiveCallCoachErrorsCP() {
  const dispatch = useAppDispatch()
  const coachError = useAppSelector((s) => s.liveCalls.coachError)
  const noteError = useAppSelector((s) => s.liveCalls.noteError)

  if (!coachError && !noteError) return null

  return (
    <>
      {coachError ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCoachErrors())}>
          {coachError}
        </Alert>
      ) : null}
      {noteError ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCoachErrors())}>
          {noteError}
        </Alert>
      ) : null}
    </>
  )
}
