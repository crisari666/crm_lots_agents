import { Alert, Box, Stack, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditRecord } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditFormAiSectionCPProps = {
  loading: boolean
  ai: CallAuditRecord | null
}

export default function CallAuditFormAiSectionCP({ loading, ai }: CallAuditFormAiSectionCPProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {s.aiSection}
      </Typography>
      {loading ? (
        <Typography variant="body2" color="text.secondary">
          …
        </Typography>
      ) : null}
      {!loading && ai === null ? (
        <Typography variant="body2" color="text.secondary">
          {s.noAiYet}
        </Typography>
      ) : null}
      {!loading && ai?.status === "pending" ? (
        <Typography variant="body2" color="text.secondary">
          {s.aiPending}
        </Typography>
      ) : null}
      {!loading && ai?.status === "failed" ? (
        <Alert severity="warning">
          {s.aiFailed}
          {ai.llmError ? `: ${ai.llmError}` : ""}
        </Alert>
      ) : null}
      {!loading && ai?.status === "completed" ? (
        <Stack spacing={1}>
          {ai.indicators.map((ind) => (
            <Box key={ind.key}>
              {ind.rationale ? (
                <Typography variant="caption" color="text.secondary" display="block">
                  <strong>{ind.label}:</strong> {ind.rationale}
                </Typography>
              ) : null}
              {ind.evidence ? (
                <Typography variant="caption" color="text.secondary" display="block" fontStyle="italic">
                  «{ind.evidence}»
                </Typography>
              ) : null}
            </Box>
          ))}
          {ai.interestScoreRationale ? (
            <Typography variant="body2" color="text.secondary">
              {s.interestScore}: {ai.interestScoreRationale}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
    </Box>
  )
}
