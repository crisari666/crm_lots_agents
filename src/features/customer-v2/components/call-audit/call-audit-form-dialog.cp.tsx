import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CustomerCallLogAdminItem, CustomerCallLogAdminOutcome } from "../../services/customers-ms.service"
import {
  analyzeCallAuditThunk,
  clearCallAuditErrorAct,
  fetchCallAuditConfigThunk,
  fetchCallAuditsByCallThunk,
  selectCallAuditsByCallLogId,
  selectIsLoadingCallAuditsByCallLogId,
  submitHumanCallAuditThunk,
} from "../../redux/customer-call-audit.slice"
import CallAuditAiIndicatorsTableCP from "./call-audit-ai-indicators-table.cp"
import CallAuditFormAiSectionCP from "./call-audit-form-ai-section.cp"
import CallAuditFormCallHeaderCP from "./call-audit-form-call-header.cp"
import CallAuditFormDiarizedSectionCP from "./call-audit-form-diarized-section.cp"
import CallAuditFormHumanSectionCP from "./call-audit-form-human-section.cp"
import CallAuditFormTranscriptSectionCP from "./call-audit-form-transcript-section.cp"
import { resolveCallAuditUserLabel } from "./call-audit-user-label.util"

export type CallAuditFormDialogCPProps = {
  open: boolean
  callLogId: string
  onClose: () => void
  callRow?: CustomerCallLogAdminItem
}

export default function CallAuditFormDialogCP({
  open,
  callLogId,
  onClose,
  callRow,
}: CallAuditFormDialogCPProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.login.currentUser)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const isAdmin = currentUser?.level === 0
  const config = useAppSelector((state) => state.customerCallAudit.config)
  const auditsByCall = useAppSelector((state) => selectCallAuditsByCallLogId(state, callLogId))
  const loadingAudits = useAppSelector((state) =>
    selectIsLoadingCallAuditsByCallLogId(state, callLogId)
  )
  const { submitting, analyzingCallLogIds, error } = useAppSelector(
    (state) => state.customerCallAudit
  )
  const [callMeta] = useState<CustomerCallLogAdminItem | null>(callRow ?? null)
  const [interestScore, setInterestScore] = useState(3)
  const [reviewerNotes, setReviewerNotes] = useState("")
  const [humanChecks, setHumanChecks] = useState<Record<string, boolean>>({})
  const currentUserId = currentUser?._id ?? ""
  const existingAuditorId = auditsByCall?.human?.auditorUserId ?? ""
  const isLockedToOther =
    existingAuditorId !== "" && existingAuditorId !== currentUserId
  const isOwnAudit =
    existingAuditorId !== "" && existingAuditorId === currentUserId
  const isAnalyzingThis = analyzingCallLogIds.includes(callLogId)
  useEffect(() => {
    if (!open) {
      return
    }
    void dispatch(fetchCallAuditConfigThunk())
    void dispatch(fetchCallAuditsByCallThunk(callLogId))
  }, [open, callLogId, dispatch])
  const indicators = useMemo(() => config?.indicators ?? [], [config?.indicators])
  useEffect(() => {
    if (auditsByCall?.human?.indicators !== undefined) {
      const map: Record<string, boolean> = {}
      for (const ind of auditsByCall.human.indicators) {
        map[ind.key] = ind.passed
      }
      setHumanChecks(map)
      setInterestScore(auditsByCall.human.interestScore)
      setReviewerNotes(auditsByCall.human.reviewerNotes ?? "")
    } else if (indicators.length > 0) {
      const map: Record<string, boolean> = {}
      for (const ind of indicators) {
        map[ind.key] = false
      }
      setHumanChecks(map)
    }
  }, [auditsByCall?.human, indicators])
  const transcript = useMemo(() => {
    const fromRow = (callMeta?.transcript ?? callMeta?.text ?? "").trim()
    if (fromRow !== "") {
      return fromRow
    }
    return (auditsByCall?.transcript ?? "").trim()
  }, [callMeta, auditsByCall?.transcript])
  const callSid = callMeta?.callSid ?? auditsByCall?.callSid ?? ""
  const resolvedOutcome: CustomerCallLogAdminOutcome =
    callMeta?.resolvedOutcome ??
    (auditsByCall?.resolvedOutcome as CustomerCallLogAdminOutcome | undefined) ??
    "answered"
  const handleSave = useCallback(() => {
    const body = {
      indicators: indicators.map((ind) => ({
        key: ind.key,
        passed: humanChecks[ind.key] === true,
      })),
      interestScore,
      reviewerNotes: reviewerNotes.trim() !== "" ? reviewerNotes.trim() : undefined,
    }
    void dispatch(submitHumanCallAuditThunk({ callLogId, body })).then((result) => {
      if (submitHumanCallAuditThunk.fulfilled.match(result)) {
        onClose()
      }
    })
  }, [callLogId, dispatch, humanChecks, indicators, interestScore, onClose, reviewerNotes])
  const scoreMin = config?.interestScore.min ?? 1
  const scoreMax = config?.interestScore.max ?? 5
  const scoreOptions = useMemo(() => {
    const opts: number[] = []
    for (let i = scoreMin; i <= scoreMax; i += 1) {
      opts.push(i)
    }
    return opts
  }, [scoreMin, scoreMax])
  const ai = isAdmin ? (auditsByCall?.ai ?? null) : null
  const speakerTurns = isAdmin ? (ai?.speakerTurns ?? []) : []
  const handleHumanCheckChange = useCallback((key: string, passed: boolean) => {
    setHumanChecks((prev) => ({ ...prev, [key]: passed }))
  }, [])
  const lockedAuditorLabel = resolveCallAuditUserLabel(existingAuditorId, usersOriginal)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <span>{s.auditCall}</span>
          {isOwnAudit ? (
            <Chip size="small" label={s.yourAudit} color="primary" variant="outlined" />
          ) : null}
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallAuditErrorAct())}>
            {error}
          </Alert>
        ) : null}
        {isLockedToOther ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {s.auditedByOther} {lockedAuditorLabel}.
          </Alert>
        ) : null}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <CallAuditFormCallHeaderCP
                callSid={callSid}
                resolvedOutcome={resolvedOutcome}
                analyzing={isAnalyzingThis}
                showAiControls={isAdmin}
                onReanalyze={() => void dispatch(analyzeCallAuditThunk(callLogId))}
              />
              {isAdmin &&
              !loadingAudits &&
              ai?.status === "completed" &&
              (ai.indicators.length > 0 || ai.interestScore !== undefined) ? (
                <CallAuditAiIndicatorsTableCP
                  indicators={ai.indicators}
                  interestScore={ai.interestScore}
                />
              ) : null}
              <CallAuditFormTranscriptSectionCP transcript={transcript} />
              {isAdmin ? (
                <>
                  <CallAuditFormAiSectionCP loading={loadingAudits} ai={ai} />
                  <CallAuditFormDiarizedSectionCP speakerTurns={speakerTurns} />
                </>
              ) : null}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <CallAuditFormHumanSectionCP
              config={config}
              humanChecks={humanChecks}
              onHumanCheckChange={handleHumanCheckChange}
              interestScore={interestScore}
              onInterestScoreChange={setInterestScore}
              reviewerNotes={reviewerNotes}
              onReviewerNotesChange={setReviewerNotes}
              scoreOptions={scoreOptions}
              readOnly={isLockedToOther}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ cursor: "pointer" }}>
          {s.close}
        </Button>
        {!isLockedToOther ? (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={submitting || indicators.length === 0}
            sx={{ cursor: "pointer" }}
          >
            {s.saveAudit}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
