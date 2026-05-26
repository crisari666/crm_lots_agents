import { useEffect } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import CallLogPlayRecordingButtonCP from "../customer-detail/call-log-play-recording-button.cp"
import type { CallAuditAiReviewItem } from "../../services/customers-ms-admin-call-audit.types"
import {
  analyzeCallAuditThunk,
  clearCallAuditErrorAct,
  fetchCallAuditsByCallThunk,
} from "../../redux/customer-call-audit.slice"

export type CallAuditAiReadonlyDialogCPProps = {
  open: boolean
  item: CallAuditAiReviewItem
  onClose: () => void
}

export default function CallAuditAiReadonlyDialogCP({
  open,
  item,
  onClose,
}: CallAuditAiReadonlyDialogCPProps) {
  const dispatch = useAppDispatch()
  const { auditsByCall, loadingAudits, analyzingCallLogIds, error } = useAppSelector(
    (state) => state.customerCallAudit
  )
  useEffect(() => {
    if (!open) {
      return
    }
    void dispatch(fetchCallAuditsByCallThunk(item.callLogId))
  }, [open, item.callLogId, dispatch])
  const ai = auditsByCall?.ai ?? item.ai
  const transcript = (auditsByCall?.transcript ?? "").trim()
  const when = item.completedAt ? moment(item.completedAt) : null
  const isAnalyzingThis = analyzingCallLogIds.includes(item.callLogId)
  const canRunAi =
    item.aiStatus === "none" || item.aiStatus === "failed" || item.aiStatus === "pending"
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {s.viewAi} · {item.callSid}
      </DialogTitle>
      <DialogContent dividers>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallAuditErrorAct())}>
            {error}
          </Alert>
        ) : null}
        <Stack spacing={2}>
          {when !== null ? (
            <Typography variant="body2" color="text.secondary">
              {when.format("DD/MM/YY HH:mm")}
              {item.durationSeconds !== undefined
                ? ` · ${Math.round(item.durationSeconds)}s`
                : ""}
            </Typography>
          ) : null}
          <Stack direction="row" spacing={1} alignItems="center">
            <CallLogPlayRecordingButtonCP callSid={item.callSid} resolvedOutcome="answered" />
            {canRunAi ? (
              <Button
                size="small"
                variant="contained"
                disabled={isAnalyzingThis}
                onClick={() => void dispatch(analyzeCallAuditThunk(item.callLogId))}
                startIcon={
                  isAnalyzingThis ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
                sx={{ cursor: "pointer" }}
              >
                {isAnalyzingThis ? s.aiStatusPending : s.runAiAnalysis}
              </Button>
            ) : null}
          </Stack>
          {transcript !== "" ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {s.transcriptSection}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                {transcript}
              </Typography>
            </Box>
          ) : null}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {s.aiSection}
            </Typography>
            {loadingAudits ? (
              <Typography variant="body2" color="text.secondary">
                …
              </Typography>
            ) : null}
            {!loadingAudits && ai === null ? (
              <Typography variant="body2" color="text.secondary">
                {s.noAiYet}
              </Typography>
            ) : null}
            {!loadingAudits && ai?.status === "pending" ? (
              <Typography variant="body2" color="text.secondary">
                {s.aiPending}
              </Typography>
            ) : null}
            {!loadingAudits && ai?.status === "failed" ? (
              <Alert severity="warning">
                {s.aiFailed}
                {ai.llmError ? `: ${ai.llmError}` : ""}
              </Alert>
            ) : null}
            {!loadingAudits && ai?.status === "completed" ? (
              <Stack spacing={1}>
                {ai.indicators.map((ind) => (
                  <Box key={ind.key}>
                    <Typography variant="body2" fontWeight={600}>
                      {ind.label}: {ind.passed ? "Sí" : "No"}
                    </Typography>
                    {ind.rationale ? (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {ind.rationale}
                      </Typography>
                    ) : null}
                    {ind.evidence ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        fontStyle="italic"
                      >
                        «{ind.evidence}»
                      </Typography>
                    ) : null}
                  </Box>
                ))}
                <Typography variant="body2">
                  {s.interestScore}: {ai.interestScore}
                  {ai.interestScoreRationale ? ` — ${ai.interestScoreRationale}` : ""}
                </Typography>
              </Stack>
            ) : null}
          </Box>
          {ai?.speakerTurns !== undefined && ai.speakerTurns.length > 0 ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {s.diarizedSection}
              </Typography>
              <Stack spacing={0.5}>
                {ai.speakerTurns.map((turn, idx) => (
                  <Typography key={`${turn.role}-${idx}`} variant="body2">
                    <strong>{turn.role === "agent" ? "Asesor" : "Cliente"}:</strong> {turn.text}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ cursor: "pointer" }}>
          {s.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
