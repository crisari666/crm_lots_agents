import { Box, Stack, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditSpeakerTurn } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditFormDiarizedSectionCPProps = {
  speakerTurns: CallAuditSpeakerTurn[]
}

function formatTurnClock(startMs: number | undefined, originMs: number): string {
  if (startMs === undefined || !Number.isFinite(startMs)) {
    return ""
  }
  const relative = Math.max(0, startMs - originMs)
  const totalSeconds = Math.floor(relative / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export default function CallAuditFormDiarizedSectionCP({
  speakerTurns,
}: CallAuditFormDiarizedSectionCPProps) {
  if (speakerTurns.length === 0) {
    return null
  }
  const originMs =
    speakerTurns.find((t) => typeof t.startMs === "number")?.startMs ?? 0
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {s.diarizedSection}
      </Typography>
      <Stack spacing={0.5}>
        {speakerTurns.map((turn, idx) => {
          const clock = formatTurnClock(turn.startMs, originMs)
          const roleLabel =
            turn.speakerLabel?.trim() ||
            (turn.role === "agent" ? "Asesor" : "Cliente")
          return (
            <Typography key={`${turn.role}-${idx}`} variant="body2">
              {clock !== "" ? (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ mr: 0.75 }}>
                  [{clock}]
                </Typography>
              ) : null}
              <strong>{roleLabel}:</strong> {turn.text}
            </Typography>
          )
        })}
      </Stack>
    </Box>
  )
}
