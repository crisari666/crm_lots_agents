import { Box, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"

export type CallAuditFormTranscriptSectionCPProps = {
  transcript: string
}

export default function CallAuditFormTranscriptSectionCP({
  transcript,
}: CallAuditFormTranscriptSectionCPProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {s.transcriptSection}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
        {transcript || "—"}
      </Typography>
    </Box>
  )
}
