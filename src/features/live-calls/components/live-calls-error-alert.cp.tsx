import { Alert } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"

export default function LiveCallsErrorAlertCP() {
  const error = useAppSelector((s) => s.liveCalls.error)
  if (!error) return null
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  )
}
