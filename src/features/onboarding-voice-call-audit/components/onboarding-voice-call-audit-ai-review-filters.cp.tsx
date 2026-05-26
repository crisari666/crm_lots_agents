import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { onboardingVoiceCallAuditStrings as s } from "../../../i18n/locales/onboarding-voice-call-audit.strings"
import {
  analyzeOnboardingVoiceCallAuditBackfillThunk,
  fetchOnboardingVoiceCallAuditAiReviewThunk,
  fetchOnboardingVoiceCallAuditConfigThunk,
  setOnboardingVoiceCallAuditFiltersAct,
} from "../slice/onboarding-voice-call-audit.slice"

export default function OnboardingVoiceCallAuditAiReviewFiltersCP() {
  const dispatch = useAppDispatch()
  const { filters, loadingAiReview, isBackfillRunning, backfillResult, config } =
    useAppSelector((state) => state.onboardingVoiceCallAudit)
  const [isBackfillDialogOpen, setIsBackfillDialogOpen] = useState(false)
  useEffect(() => {
    if (config === null) {
      void dispatch(fetchOnboardingVoiceCallAuditConfigThunk())
    }
  }, [dispatch, config])
  const runSearch = () => {
    void dispatch(
      fetchOnboardingVoiceCallAuditAiReviewThunk({
        month: filters.month,
        limit: 200,
        skip: 0,
        ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
      })
    )
  }
  useEffect(() => {
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const runBackfill = () => {
    setIsBackfillDialogOpen(false)
    void dispatch(analyzeOnboardingVoiceCallAuditBackfillThunk())
  }
  const backfillMessage =
    backfillResult !== null
      ? s.backfillResult
          .replace("{processed}", String(backfillResult.processed))
          .replace("{skipped}", String(backfillResult.skipped))
          .replace("{failed}", String(backfillResult.failed))
      : ""
  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          useFlexGap
          flexWrap="wrap"
        >
          <TextField
            label={s.monthLabel}
            type="month"
            size="small"
            value={filters.month}
            onChange={(e) =>
              dispatch(setOnboardingVoiceCallAuditFiltersAct({ month: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.onlyWithoutAi}
                onChange={(e) =>
                  dispatch(
                    setOnboardingVoiceCallAuditFiltersAct({
                      onlyWithoutAi: e.target.checked,
                    })
                  )
                }
              />
            }
            label={s.onlyWithoutAi}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={runSearch}
            disabled={loadingAiReview || isBackfillRunning || filters.month === ""}
            sx={{ cursor: "pointer" }}
          >
            {s.search}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsBackfillDialogOpen(true)}
            disabled={loadingAiReview || isBackfillRunning || filters.month === ""}
            sx={{ cursor: "pointer" }}
          >
            {s.backfillButton}
          </Button>
        </Stack>
        {backfillResult !== null ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {backfillMessage}
          </Alert>
        ) : null}
      </Paper>
      <Dialog open={isBackfillDialogOpen} onClose={() => setIsBackfillDialogOpen(false)}>
        <DialogTitle>{s.backfillConfirmTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>{s.backfillConfirmBody}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBackfillDialogOpen(false)} sx={{ cursor: "pointer" }}>
            {s.backfillCancel}
          </Button>
          <Button variant="contained" onClick={runBackfill} sx={{ cursor: "pointer" }}>
            {s.backfillConfirmAction}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
