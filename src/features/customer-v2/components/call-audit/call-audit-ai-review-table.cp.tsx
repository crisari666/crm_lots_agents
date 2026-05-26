import { useState } from "react"
import {
  Alert,
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
  TableRow,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditAiReviewItem } from "../../services/customers-ms-admin-call-audit.types"
import {
  analyzeCallAuditThunk,
  clearCallAuditErrorAct,
} from "../../redux/customer-call-audit.slice"
import CallAuditAiReadonlyDialogCP from "./call-audit-ai-readonly-dialog.cp"

function resolveUserLabel(
  userId: string,
  users: { _id?: string; name?: string; lastName?: string }[]
): string {
  const user = users.find((u) => u._id === userId)
  if (user === undefined) {
    return userId
  }
  return [user.name, user.lastName].filter(Boolean).join(" ").trim() || userId
}

function aiStatusLabel(status: CallAuditAiReviewItem["aiStatus"]): string {
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
  status: CallAuditAiReviewItem["aiStatus"]
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

export default function CallAuditAiReviewTableCP() {
  const dispatch = useAppDispatch()
  const { aiReview, loadingAiReview, error, analyzingCallLogIds } = useAppSelector(
    (state) => state.customerCallAudit
  )
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const [viewItem, setViewItem] = useState<CallAuditAiReviewItem | null>(null)
  const items = aiReview?.items ?? []
  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallAuditErrorAct())}>
          {error}
        </Alert>
      ) : null}
      {loadingAiReview ? <LinearProgress sx={{ mb: 2 }} /> : null}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {aiReview?.total ?? 0} llamada{(aiReview?.total ?? 0) === 1 ? "" : "s"}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.callColumn}</TableCell>
              <TableCell>{s.agentColumn}</TableCell>
              <TableCell>{s.aiStatusColumn}</TableCell>
              <TableCell align="right">{s.actionsColumn}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && !loadingAiReview ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary">
                    Sin datos para el mes seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {items.map((row) => {
              const when = row.completedAt ? moment(row.completedAt) : null
              const agentLabel = resolveUserLabel(row.agentExternalRef, usersOriginal)
              const isAnalyzing = analyzingCallLogIds.includes(row.callLogId)
              const needsAi =
                row.aiStatus === "none" || row.aiStatus === "failed" || row.aiStatus === "pending"
              return (
                <TableRow
                  key={row.callLogId}
                  hover
                  sx={{ bgcolor: isAnalyzing ? "action.selected" : undefined }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {when !== null ? when.format("DD/MM/YY HH:mm") : row.callSid}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {row.callSid}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {agentLabel}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={aiStatusLabel(row.aiStatus)}
                      color={aiStatusColor(row.aiStatus)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {needsAi ? (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={isAnalyzing}
                          onClick={() => void dispatch(analyzeCallAuditThunk(row.callLogId))}
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
      </TableContainer>
      {viewItem !== null ? (
        <CallAuditAiReadonlyDialogCP
          open
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      ) : null}
    </>
  )
}
