import { useEffect, useMemo } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import CallLogPlayRecordingButtonCP from "../customer-detail/call-log-play-recording-button.cp"
import type { CallAuditAiReviewItem } from "../../services/customers-ms-admin-call-audit.types"
import {
  analyzeCallAuditThunk,
  clearCallAuditErrorAct,
  clearCallAuditsByCallAct,
  fetchCallAuditsByCallThunk,
  selectCallAuditsByCallLogId,
  selectIsLoadingCallAuditsByCallLogId,
} from "../../redux/customer-call-audit.slice"
import CallAuditAiResultSummaryCP from "./call-audit-ai-result-summary.cp"

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
  const callLogId = item.callLogId
  const auditsByCall = useAppSelector((state) => selectCallAuditsByCallLogId(state, callLogId))
  const loadingAudits = useAppSelector((state) =>
    selectIsLoadingCallAuditsByCallLogId(state, callLogId)
  )
  const { aiReview, analyzingCallLogIds, error, config } = useAppSelector(
    (state) => state.customerCallAudit
  )
  const liveItem = useMemo((): CallAuditAiReviewItem => {
    const fromList = aiReview?.items.find((row) => row.callLogId === callLogId)
    return fromList ?? item
  }, [aiReview?.items, callLogId, item])
  useEffect(() => {
    if (!open) {
      return
    }
    void dispatch(fetchCallAuditsByCallThunk(callLogId))
  }, [open, callLogId, dispatch])
  const handleClose = () => {
    dispatch(clearCallAuditsByCallAct(callLogId))
    onClose()
  }
  const cachedAi =
    auditsByCall !== null && auditsByCall.callLogId === callLogId ? auditsByCall.ai : null
  const ai = cachedAi ?? liveItem.ai
  const transcript =
    auditsByCall !== null && auditsByCall.callLogId === callLogId
      ? (auditsByCall.transcript ?? "").trim()
      : ""
  const when = liveItem.completedAt ? moment(liveItem.completedAt) : null
  const isAnalyzingThis = analyzingCallLogIds.includes(callLogId)
  const canRunAi =
    liveItem.aiStatus === "none" ||
    liveItem.aiStatus === "failed" ||
    liveItem.aiStatus === "pending"
  const hasRubricDetail =
    !loadingAudits && ai?.status === "completed" && ai.indicators.length > 0
  const hasDiarized = ai?.speakerTurns !== undefined && ai.speakerTurns.length > 0
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {s.viewAi} · {liveItem.callSid}
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
              {liveItem.durationSeconds !== undefined
                ? ` · ${Math.round(liveItem.durationSeconds)}s`
                : ""}
            </Typography>
          ) : null}
          <Paper variant="outlined" sx={{ p: 2 }}>
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
              <CallAuditAiResultSummaryCP
                ai={ai}
                aiStatus="completed"
                config={config}
                variant="dialog"
              />
            ) : null}
            {isAnalyzingThis && (ai === null || ai.status !== "completed") ? (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  {s.aiStatusPending}
                </Typography>
              </Stack>
            ) : null}
          </Paper>
          <Stack direction="row" spacing={1} alignItems="center">
            <CallLogPlayRecordingButtonCP callSid={liveItem.callSid} resolvedOutcome="answered" />
            {canRunAi ? (
              <Button
                size="small"
                variant="contained"
                disabled={isAnalyzingThis}
                onClick={() => void dispatch(analyzeCallAuditThunk(callLogId))}
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
          {hasRubricDetail ? (
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{s.accordionRubricDetail}</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {transcript !== "" ? (
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{s.accordionTranscript}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                  {transcript}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {hasDiarized ? (
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{s.accordionDiarized}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  {ai.speakerTurns!.map((turn, idx) => (
                    <Typography key={`${turn.role}-${idx}`} variant="body2">
                      <strong>{turn.role === "agent" ? "Asesor" : "Cliente"}:</strong> {turn.text}
                    </Typography>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ cursor: "pointer" }}>
          {s.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
