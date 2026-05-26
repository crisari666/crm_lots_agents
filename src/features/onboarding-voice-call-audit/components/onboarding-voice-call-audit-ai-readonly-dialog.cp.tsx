import { useMemo } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { onboardingVoiceCallAuditStrings as s } from "../../../i18n/locales/onboarding-voice-call-audit.strings"
import type { OnboardingVoiceCallAuditAiReviewItem } from "../types/onboarding-voice-call-audit.types"
import {
  analyzeOnboardingVoiceCallAuditFlowThunk,
  clearOnboardingVoiceCallAuditErrorAct,
} from "../slice/onboarding-voice-call-audit.slice"
import OnboardingVoiceCallAuditResultSummaryCP from "./onboarding-voice-call-audit-result-summary.cp"

export type OnboardingVoiceCallAuditAiReadonlyDialogCPProps = {
  open: boolean
  item: OnboardingVoiceCallAuditAiReviewItem
  onClose: () => void
}

export default function OnboardingVoiceCallAuditAiReadonlyDialogCP({
  open,
  item,
  onClose,
}: OnboardingVoiceCallAuditAiReadonlyDialogCPProps) {
  const dispatch = useAppDispatch()
  const { aiReview, analyzingFlowIds, error, config } = useAppSelector(
    (state) => state.onboardingVoiceCallAudit
  )
  const liveItem = useMemo((): OnboardingVoiceCallAuditAiReviewItem => {
    const fromList = aiReview?.items.find((row) => row.flowId === item.flowId)
    return fromList ?? item
  }, [aiReview?.items, item])
  const ai = liveItem.ai
  const when = moment(liveItem.transcriptEventAt)
  const isAnalyzing = analyzingFlowIds.includes(liveItem.flowId)
  const canRunAi =
    !liveItem.isVoicemailFlow &&
    (liveItem.aiStatus === "none" ||
      liveItem.aiStatus === "failed" ||
      liveItem.aiStatus === "pending")
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {s.viewAi} · {liveItem.leadName}
      </DialogTitle>
      <DialogContent dividers>
        {error !== null ? (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => dispatch(clearOnboardingVoiceCallAuditErrorAct())}
          >
            {error}
          </Alert>
        ) : null}
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {when.format("DD/MM/YY HH:mm")} · {liveItem.phoneNumber}
          </Typography>
          {liveItem.isVoicemailFlow ? (
            <Chip size="small" label={s.voicemailChip} color="default" />
          ) : null}
          <OnboardingVoiceCallAuditResultSummaryCP
            ai={ai}
            aiStatus={liveItem.aiStatus}
            config={config}
          />
          {ai !== null && ai.status === "completed" && ai.indicators.length > 0 ? (
            <Accordion defaultExpanded disableGutters variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Indicadores</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  {ai.indicators.map((row) => (
                    <Stack key={row.key} spacing={0.25}>
                      <Typography variant="body2" fontWeight={600}>
                        {row.label}: {row.passed ? "Cumple" : "No cumple"}
                      </Typography>
                      {row.rationale !== undefined && row.rationale !== "" ? (
                        <Typography variant="caption" color="text.secondary">
                          {row.rationale}
                        </Typography>
                      ) : null}
                    </Stack>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {ai?.speakerTurns !== undefined && ai.speakerTurns.length > 0 ? (
            <Accordion disableGutters variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Diálogo inferido</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  {ai.speakerTurns.map((turn, index) => (
                    <Typography key={`${turn.role}-${index}`} variant="body2">
                      <strong>{turn.role === "agent" ? "Agente" : "Cliente"}:</strong>{" "}
                      {turn.text}
                    </Typography>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {ai?.llmError !== undefined && ai.llmError !== "" ? (
            <Alert severity="error">{ai.llmError}</Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        {canRunAi ? (
          <Button
            variant="outlined"
            disabled={isAnalyzing}
            onClick={() => void dispatch(analyzeOnboardingVoiceCallAuditFlowThunk(liveItem.flowId))}
            sx={{ cursor: "pointer" }}
          >
            {isAnalyzing ? s.aiStatusPending : s.runAiAnalysis}
          </Button>
        ) : null}
        <Button onClick={onClose} sx={{ cursor: "pointer" }}>
          {s.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
