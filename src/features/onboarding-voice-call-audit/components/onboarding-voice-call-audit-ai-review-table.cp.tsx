import { useState, type ChangeEvent, type MouseEvent } from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { onboardingVoiceCallAuditStrings as s } from "../../../i18n/locales/onboarding-voice-call-audit.strings"
import { buildOnboardingVoiceCallAuditAiReviewParams } from "../business-logic/build-onboarding-voice-call-audit-ai-review-params.util"
import {
  analyzeOnboardingVoiceCallAuditFlowThunk,
  clearOnboardingVoiceCallAuditErrorAct,
  fetchOnboardingVoiceCallAuditAiReviewThunk,
  setOnboardingVoiceCallAuditFiltersAct,
} from "../slice/onboarding-voice-call-audit.slice"
import type {
  OnboardingVoiceCallAuditAiReviewItem,
  OnboardingVoiceCallAuditAiReviewPageLimit,
} from "../types/onboarding-voice-call-audit.types"
import OnboardingVoiceCallAuditAiReadonlyDialogCP from "./onboarding-voice-call-audit-ai-readonly-dialog.cp"
import OnboardingVoiceCallAuditAiReviewKpisCP from "./onboarding-voice-call-audit-ai-review-kpis.cp"
import OnboardingVoiceCallAuditResultSummaryCP from "./onboarding-voice-call-audit-result-summary.cp"

function aiStatusLabel(status: OnboardingVoiceCallAuditAiReviewItem["aiStatus"]): string {
  switch (status) {
    case "none":
      return s.aiStatusNone
    case "pending":
      return s.aiStatusPending
    case "completed":
      return s.aiStatusCompleted
    case "failed":
      return s.aiStatusFailed
    default:
      return status
  }
}

function aiStatusColor(
  status: OnboardingVoiceCallAuditAiReviewItem["aiStatus"]
): "default" | "warning" | "success" | "error" {
  switch (status) {
    case "completed":
      return "success"
    case "failed":
      return "error"
    case "pending":
      return "warning"
    default:
      return "default"
  }
}

function formatPaginationRange(from: number, to: number, total: number): string {
  return s.paginationRange
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{total}", String(total))
}

export default function OnboardingVoiceCallAuditAiReviewTableCP() {
  const dispatch = useAppDispatch()
  const { aiReview, loadingAiReview, isBackfillRunning, error, analyzingFlowIds, config, filters } =
    useAppSelector((state) => state.onboardingVoiceCallAudit)
  const [viewItem, setViewItem] = useState<OnboardingVoiceCallAuditAiReviewItem | null>(null)
  const items = aiReview?.items ?? []
  const total = aiReview?.total ?? 0
  const skip = aiReview?.skip ?? 0
  const rangeFrom = total === 0 ? 0 : skip + 1
  const rangeTo = Math.min(skip + items.length, total)
  const stopRowClick = (event: MouseEvent) => {
    event.stopPropagation()
  }
  const fetchPage = (nextPage: number, nextLimit: OnboardingVoiceCallAuditAiReviewPageLimit) => {
    const nextFilters = { ...filters, page: nextPage, limit: nextLimit }
    dispatch(setOnboardingVoiceCallAuditFiltersAct({ page: nextPage, limit: nextLimit }))
    void dispatch(
      fetchOnboardingVoiceCallAuditAiReviewThunk(
        buildOnboardingVoiceCallAuditAiReviewParams(nextFilters)
      )
    )
  }
  const onChangePage = (_: unknown, newPage: number) => {
    fetchPage(newPage, filters.limit)
  }
  const onChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const nextLimit = Number(event.target.value) as OnboardingVoiceCallAuditAiReviewPageLimit
    fetchPage(0, nextLimit)
  }
  return (
    <>
      {error !== null ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearOnboardingVoiceCallAuditErrorAct())}
        >
          {error}
        </Alert>
      ) : null}
      {loadingAiReview || isBackfillRunning ? <LinearProgress sx={{ mb: 2 }} /> : null}
      <OnboardingVoiceCallAuditAiReviewKpisCP />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {formatPaginationRange(rangeFrom, rangeTo, total)}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.flowColumn}</TableCell>
              <TableCell>{s.phoneColumn}</TableCell>
              <TableCell>{s.dateColumn}</TableCell>
              <TableCell>{s.interestColumn}</TableCell>
              <TableCell>{s.rubricColumn}</TableCell>
              <TableCell>{s.aiStatusColumn}</TableCell>
              <TableCell align="right">{s.actionsColumn}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && !loadingAiReview ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary">
                    {s.noData}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {items.map((row) => {
              const when = moment(row.transcriptEventAt)
              const isAnalyzing = analyzingFlowIds.includes(row.flowId)
              const needsAi =
                !row.isVoicemailFlow &&
                (row.aiStatus === "none" ||
                  row.aiStatus === "failed" ||
                  row.aiStatus === "pending")
              const canOpen = row.aiStatus !== "none" || isAnalyzing
              return (
                <TableRow
                  key={row.flowId}
                  hover
                  onClick={() => {
                    if (canOpen) {
                      setViewItem(row)
                    }
                  }}
                  sx={{ cursor: canOpen ? "pointer" : "default" }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {row.leadName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {row.flowId}
                    </Typography>
                    {row.isVoicemailFlow ? (
                      <Chip size="small" label={s.voicemailChip} sx={{ mt: 0.5 }} />
                    ) : null}
                    {!row.hasTranscript ? (
                      <Chip
                        size="small"
                        label={s.noTranscriptChip}
                        color="warning"
                        variant="outlined"
                        sx={{ mt: 0.5, ml: row.isVoicemailFlow ? 0.5 : 0 }}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {row.phoneNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {when.format("DD/MM/YY HH:mm")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <OnboardingVoiceCallAuditResultSummaryCP
                      ai={row.ai}
                      aiStatus={row.aiStatus}
                      config={config}
                      showInterestOnly
                    />
                  </TableCell>
                  <TableCell>
                    <OnboardingVoiceCallAuditResultSummaryCP
                      ai={row.ai}
                      aiStatus={row.aiStatus}
                      config={config}
                      showRubricOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={aiStatusLabel(row.aiStatus)}
                      color={aiStatusColor(row.aiStatus)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" onClick={stopRowClick}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {needsAi ? (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={isAnalyzing}
                          onClick={() =>
                            void dispatch(analyzeOnboardingVoiceCallAuditFlowThunk(row.flowId))
                          }
                          startIcon={
                            isAnalyzing ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : undefined
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          {isAnalyzing ? s.aiStatusPending : s.runAiAnalysis}
                        </Button>
                      ) : null}
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setViewItem(row)}
                        disabled={row.aiStatus === "none" && !isAnalyzing}
                        sx={{ cursor: "pointer" }}
                      >
                        {s.viewAi}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {aiReview !== null ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <TablePagination
              component="div"
              count={total}
              page={filters.page}
              onPageChange={onChangePage}
              rowsPerPage={filters.limit}
              onRowsPerPageChange={onChangeRowsPerPage}
              rowsPerPageOptions={[25, 50, 100, 200]}
              labelRowsPerPage={s.paginationRowsPerPage}
            />
          </Box>
        ) : null}
      </TableContainer>
      {viewItem !== null ? (
        <OnboardingVoiceCallAuditAiReadonlyDialogCP
          open
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      ) : null}
    </>
  )
}
