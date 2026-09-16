import { Box, Stack, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditUtterance } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditFormUtterancesSectionCPProps = {
  utterances: CallAuditUtterance[]
}

function formatClock(startMs: number | undefined, originMs: number): string {
  if (startMs === undefined || !Number.isFinite(startMs)) {
    return ""
  }
  const relative = Math.max(0, startMs - originMs)
  const totalSeconds = Math.floor(relative / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export default function CallAuditFormUtterancesSectionCP({
  utterances,
}: CallAuditFormUtterancesSectionCPProps) {
  const rows = utterances.filter((u) => (u.text ?? "").trim() !== "")
  if (rows.length === 0) {
    return null
  }
  const originMs = rows.find((u) => typeof u.start === "number")?.start ?? 0
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {s.utterancesSection}
      </Typography>
      <Stack spacing={0.5} sx={{ maxHeight: 280, overflow: "auto" }}>
        {rows.map((utterance, idx) => {
          const clock = formatClock(utterance.start, originMs)
          const speaker = utterance.speaker?.trim() || "Speaker"
          return (
            <Typography key={`utt-${idx}`} variant="body2">
              {clock !== "" ? (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ mr: 0.75 }}>
                  [{clock}]
                </Typography>
              ) : null}
              <strong>{speaker}:</strong> {utterance.text}
            </Typography>
          )
        })}
      </Stack>
    </Box>
  )
}
