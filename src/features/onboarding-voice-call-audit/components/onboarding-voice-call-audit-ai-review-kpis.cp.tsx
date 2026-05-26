import { Box, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { onboardingVoiceCallAuditStrings as s } from "../../../i18n/locales/onboarding-voice-call-audit.strings"
import {
  formatOnboardingVoiceAuditCompletedPct,
  formatOnboardingVoiceAuditTopFailed,
} from "../business-logic/onboarding-voice-call-audit-summary-display"

type KpiCardProps = {
  label: string
  value: string
  tooltip?: string
}

function KpiCard({ label, value, tooltip }: KpiCardProps) {
  const content = (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </Paper>
  )
  if (tooltip !== undefined && tooltip !== "") {
    return (
      <Tooltip title={tooltip}>
        <Box sx={{ flex: 1, minWidth: 140, cursor: "default" }}>{content}</Box>
      </Tooltip>
    )
  }
  return <Box sx={{ flex: 1, minWidth: 140 }}>{content}</Box>
}

export default function OnboardingVoiceCallAuditAiReviewKpisCP() {
  const { aiReview, filters } = useAppSelector((state) => state.onboardingVoiceCallAudit)
  const summary = aiReview?.summary
  if (summary === undefined) {
    return null
  }
  const topFailed = formatOnboardingVoiceAuditTopFailed(summary)
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
        {s.kpiDateBasis} · {filters.month}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
        <KpiCard label={s.kpiTotalCalls} value={String(summary.totalEligible)} />
        <KpiCard
          label={s.kpiAiCompletedPct}
          value={formatOnboardingVoiceAuditCompletedPct(summary)}
        />
        <KpiCard
          label={s.kpiAvgInterest}
          value={
            summary.avgInterestScore !== null ? String(summary.avgInterestScore) : "—"
          }
        />
        <KpiCard
          label={s.kpiTopFailedRubric}
          value={topFailed.value}
          tooltip={topFailed.tooltip}
        />
      </Stack>
    </Box>
  )
}
