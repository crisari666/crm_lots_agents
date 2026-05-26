import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import { buildCallAuditIndicatorsSummary } from "../../business-logic/build-call-audit-indicators-summary"
import {
  buildFailedTooltip,
  formatChecklistLabel,
  interestScoreChipColor,
} from "../../business-logic/call-audit-interest-score-style"
import type {
  CallAuditAiReviewItem,
  CallAuditConfigResponse,
  CallAuditRecord,
} from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditAiResultSummaryCPProps = {
  ai: CallAuditRecord | null
  aiStatus: CallAuditAiReviewItem["aiStatus"]
  config: CallAuditConfigResponse | null
  variant: "table" | "dialog"
  showInterestOnly?: boolean
  showRubricOnly?: boolean
}

function resolveInterestLabel(
  score: number,
  config: CallAuditConfigResponse | null
): string {
  const label = config?.interestScore.labels[score]
  if (label !== undefined && label !== "") {
    return label
  }
  return String(score)
}

function aiStatusLabel(status: CallAuditAiReviewItem["aiStatus"]): string {
  switch (status) {
    case "none":
      return s.aiStatusNone
    case "pending":
      return s.aiStatusPending
    case "completed":
      return s.aiStatusCompleted
    case "failed":
      return s.aiStatusFailed
    default:
      return status
  }
}

export default function CallAuditAiResultSummaryCP({
  ai,
  aiStatus,
  config,
  variant,
  showInterestOnly = false,
  showRubricOnly = false,
}: CallAuditAiResultSummaryCPProps) {
  if (aiStatus !== "completed" || ai === null || ai.status !== "completed") {
    return (
      <Typography variant="body2" color="text.secondary">
        {aiStatus === "none" || aiStatus === "pending" ? s.noAiSummary : aiStatusLabel(aiStatus)}
      </Typography>
    )
  }
  const { passed, total, failedLabels } = buildCallAuditIndicatorsSummary(ai.indicators)
  const checklistLabel = formatChecklistLabel(passed, total, s.checklistSummary)
  const failedTooltip = buildFailedTooltip(failedLabels)
  const interestLabel = resolveInterestLabel(ai.interestScore, config)
  const showInterest = !showRubricOnly
  const showRubric = !showInterestOnly
  return (
    <Stack spacing={variant === "dialog" ? 1 : 0.5}>
      {showInterest ? (
        <Chip
          size="small"
          label={`${s.interestScore}: ${ai.interestScore} · ${interestLabel}`}
          color={interestScoreChipColor(ai.interestScore)}
          variant="outlined"
        />
      ) : null}
      {showRubric && total > 0 ? (
        <Stack direction="row" spacing={0.25} alignItems="center" flexWrap="wrap" useFlexGap>
          {ai.indicators.map((ind) => (
            <Tooltip key={ind.key} title={`${ind.label}: ${ind.passed ? "Sí" : "No"}`}>
              <Box
                component="span"
                aria-label={`${ind.label}: ${ind.passed ? "Sí" : "No"}`}
                sx={{ display: "inline-flex", lineHeight: 0 }}
              >
                {ind.passed ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <CancelOutlinedIcon fontSize="small" color="error" />
                )}
              </Box>
            </Tooltip>
          ))}
          {failedTooltip !== "" ? (
            <Tooltip title={`${s.failedIndicatorsTooltip}: ${failedTooltip}`}>
              <Typography variant="caption" color="text.secondary" sx={{ cursor: "default" }}>
                {checklistLabel}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {checklistLabel}
            </Typography>
          )}
        </Stack>
      ) : null}
      {showInterest && variant === "dialog" && ai.interestScoreRationale ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ai.interestScoreRationale}
        </Typography>
      ) : null}
    </Stack>
  )
}
