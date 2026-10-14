import React from "react"
import { Box, Chip, LinearProgress, Typography } from "@mui/material"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import type { LeadConversationStatus, LeadConversationStep } from "../types/lead-conversations.types"

const STATUS_COLOR: Record<LeadConversationStatus, "primary" | "success" | "error" | "default"> = {
  active: "primary",
  scheduled: "success",
  disqualified: "error",
  abandoned: "default",
}

export function LeadConversationStatusChipCP({ status }: { status: LeadConversationStatus }): React.ReactElement {
  return <Chip size="small" color={STATUS_COLOR[status]} variant={status === "active" ? "outlined" : "filled"} label={s.status[status]} />
}

export function LeadConversationStepChipCP({ step }: { step: LeadConversationStep }): React.ReactElement {
  return <Chip size="small" variant="outlined" label={s.step[step]} sx={{ borderStyle: "dashed" }} />
}

type ScoreProps = { score: number; maxScore: number; priority: number }

/** Compact score meter: bar filled by score, label with priority. */
export function LeadConversationScoreCP({ score, maxScore, priority }: ScoreProps): React.ReactElement {
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  return (
    <Box sx={{ minWidth: 110 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
        <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>
          {s.scoreValue(score, maxScore)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {s.priority[priority] ?? ""}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        color={priority >= 3 ? "success" : priority === 2 ? "primary" : "inherit"}
        sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
        aria-label={s.scoreValue(score, maxScore)}
      />
    </Box>
  )
}
