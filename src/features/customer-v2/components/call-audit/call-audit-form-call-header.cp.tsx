import { Button, Stack, Typography } from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CustomerCallLogAdminOutcome } from "../../services/customers-ms.service"
import CallLogPlayRecordingButtonCP from "../customer-detail/call-log-play-recording-button.cp"

export type CallAuditFormCallHeaderCPProps = {
  callSid: string
  resolvedOutcome: CustomerCallLogAdminOutcome
  analyzing: boolean
  showAiControls: boolean
  onReanalyze: () => void
}

export default function CallAuditFormCallHeaderCP({
  callSid,
  resolvedOutcome,
  analyzing,
  showAiControls,
  onReanalyze,
}: CallAuditFormCallHeaderCPProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="subtitle2">{callSid}</Typography>
      {callSid !== "" ? (
        <CallLogPlayRecordingButtonCP callSid={callSid} resolvedOutcome={resolvedOutcome} />
      ) : null}
      {showAiControls ? (
        <Button
          size="small"
          variant="outlined"
          disabled={analyzing}
          onClick={onReanalyze}
          sx={{ cursor: "pointer" }}
        >
          {s.reanalyzeAi}
        </Button>
      ) : null}
    </Stack>
  )
}
