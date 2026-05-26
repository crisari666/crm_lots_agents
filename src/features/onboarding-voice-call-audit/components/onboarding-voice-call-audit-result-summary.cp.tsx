import { Chip, Stack, Typography } from "@mui/material"
import type {
  OnboardingVoiceCallAuditConfigResponse,
  OnboardingVoiceCallAuditRecord,
} from "../types/onboarding-voice-call-audit.types"

type Props = {
  ai: OnboardingVoiceCallAuditRecord | null
  aiStatus: "none" | "pending" | "completed" | "failed"
  config: OnboardingVoiceCallAuditConfigResponse | null
  showInterestOnly?: boolean
  showRubricOnly?: boolean
}

export default function OnboardingVoiceCallAuditResultSummaryCP({
  ai,
  aiStatus,
  config,
  showInterestOnly = false,
  showRubricOnly = false,
}: Props) {
  if (aiStatus === "none" || aiStatus === "pending") {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    )
  }
  if (aiStatus === "failed" || ai === null) {
    return (
      <Typography variant="body2" color="error">
        —
      </Typography>
    )
  }
  if (ai.isVoicemail) {
    return (
      <Chip size="small" label={config?.voicemailIndicator.label ?? "Buzón"} variant="outlined" />
    )
  }
  const failed = ai.indicators.filter((row) => !row.passed)
  if (showInterestOnly) {
    return <Typography variant="body2">{ai.interestScore}/5</Typography>
  }
  if (showRubricOnly) {
    if (failed.length === 0) {
      return (
        <Typography variant="body2" color="success.main">
          OK
        </Typography>
      )
    }
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {failed.slice(0, 2).map((row) => (
          <Chip key={row.key} size="small" label={row.label} color="error" variant="outlined" />
        ))}
      </Stack>
    )
  }
  return null
}
