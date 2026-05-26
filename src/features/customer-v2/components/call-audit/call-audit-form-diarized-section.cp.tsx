import { Box, Stack, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditSpeakerTurn } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditFormDiarizedSectionCPProps = {
  speakerTurns: CallAuditSpeakerTurn[]
}

export default function CallAuditFormDiarizedSectionCP({
  speakerTurns,
}: CallAuditFormDiarizedSectionCPProps) {
  if (speakerTurns.length === 0) {
    return null
  }
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {s.diarizedSection}
      </Typography>
      <Stack spacing={0.5}>
        {speakerTurns.map((turn, idx) => (
          <Typography key={`${turn.role}-${idx}`} variant="body2">
            <strong>{turn.role === "agent" ? "Asesor" : "Cliente"}:</strong> {turn.text}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
