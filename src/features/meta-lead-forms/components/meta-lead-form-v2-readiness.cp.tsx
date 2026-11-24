import { Box, Link, Skeleton, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { fetchReadinessThunk } from "../../lead-assistant/slice/lead-assistant-setup.slice"

const LEAD_ASSISTANT_PATH = "/dashboard/lead-assistant"

/** Readiness summary of the V2 assistant shown under the flow cards. */
export default function MetaLeadFormV2ReadinessCP() {
  const dispatch = useAppDispatch()
  const readiness = useAppSelector((state) => state.leadAssistant.setup.readiness)
  const status = useAppSelector((state) => state.leadAssistant.setup.readinessStatus)

  useEffect(() => {
    void dispatch(fetchReadinessThunk())
  }, [dispatch])

  const missing = readiness == null ? 0 : readiness.total - readiness.readyCount
  const isReady = readiness != null && missing <= 0

  const renderSummary = () => {
    if (readiness == null) {
      return status === "failed" ? null : <Skeleton variant="text" width={160} />
    }
    if (isReady) {
      return (
        <Typography variant="body2" fontWeight={600} color="success.main">
          {s.readinessReady}
        </Typography>
      )
    }
    const unit = missing === 1 ? s.readinessMissingStep : s.readinessMissingSteps
    return (
      <Typography variant="body2" fontWeight={600} color="warning.main">
        {`${s.readinessMissing} ${missing} ${unit}`}
      </Typography>
    )
  }

  return (
    <Box sx={{ mt: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
        {renderSummary()}
        <Link component={RouterLink} to={LEAD_ASSISTANT_PATH} variant="body2" underline="hover">
          {s.readinessLink}
        </Link>
      </Stack>
    </Box>
  )
}
