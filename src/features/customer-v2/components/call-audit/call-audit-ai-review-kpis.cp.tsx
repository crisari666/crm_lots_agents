import { Box, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import {
  formatCallAuditAiCompletedPct,
  formatCallAuditTopFailed,
} from "../../business-logic/call-audit-ai-review-summary-display"

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

export default function CallAuditAiReviewKpisCP() {
  const { aiReview, filters } = useAppSelector((state) => state.customerCallAudit)
  const summary = aiReview?.summary
  if (summary === undefined) {
    return null
  }
  const topFailed = formatCallAuditTopFailed(summary)
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
        {s.kpiDateBasisCall} · {filters.month}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
        <KpiCard label={s.kpiTotalCalls} value={String(summary.totalEligible)} />
        <KpiCard label={s.kpiAiCompletedPct} value={formatCallAuditAiCompletedPct(summary)} />
        <KpiCard
          label={s.kpiAvgInterest}
          value={
            summary.avgInterestScore !== null ? String(summary.avgInterestScore) : "—"
          }
        />
        <KpiCard label={s.kpiTopFailedRubric} value={topFailed.value} tooltip={topFailed.tooltip} />
      </Stack>
    </Box>
  )
}
