import { useMemo, useState } from "react"
import {
  Alert,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { clearCallAuditErrorAct } from "../../redux/customer-call-audit.slice"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CustomerCallLogAdminItem } from "../../services/customers-ms.service"
import type { CallAuditResultItem } from "../../services/customers-ms-admin-call-audit.types"
import { resolveCallAuditUserLabel } from "./call-audit-user-label.util"
import CallAuditFormDialogCP from "./call-audit-form-dialog.cp"

function buildCallRowFromCompleted(item: CallAuditResultItem): CustomerCallLogAdminItem {
  const createdAt = item.completedAt ?? new Date().toISOString()
  return {
    id: item.callLogId,
    callSid: item.callSid,
    provider: "twilio",
    agentExternalRef: item.agentExternalRef,
    resolvedOutcome: "answered",
    createdAt,
    updatedAt: createdAt,
    completedAt: item.completedAt,
    events: [],
  }
}

function formatIndicatorsCell(item: CallAuditResultItem): string {
  const { passed, total } = item.indicatorsSummary
  if (total === 0) {
    return "—"
  }
  return `${passed}/${total}`
}

function formatFailedTooltip(item: CallAuditResultItem): string {
  const { failedLabels } = item.indicatorsSummary
  if (failedLabels.length === 0) {
    return ""
  }
  const joined = failedLabels.join(", ")
  if (joined.length <= 120) {
    return joined
  }
  return `${joined.slice(0, 117)}…`
}

type AuditDialogState = {
  callLogId: string
  callRow?: CustomerCallLogAdminItem
}

export default function CallAuditResultsTableCP() {
  const dispatch = useAppDispatch()
  const { auditResults, loadingResults, error } = useAppSelector((state) => state.customerCallAudit)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const [auditDialog, setAuditDialog] = useState<AuditDialogState | null>(null)
  const resultRows = useMemo(() => auditResults?.items ?? [], [auditResults?.items])
  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallAuditErrorAct())}>
          {error}
        </Alert>
      ) : null}
      {loadingResults ? <LinearProgress sx={{ mb: 2 }} /> : null}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
        {s.auditResultsTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.auditResultsSubtitle}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.auditorColumn}</TableCell>
              <TableCell>{s.callerColumn}</TableCell>
              <TableCell>{s.dateColumn}</TableCell>
              <TableCell>{s.indicatorsColumn}</TableCell>
              <TableCell>{s.resumeColumn}</TableCell>
              <TableCell align="right" width={56} />
            </TableRow>
          </TableHead>
          <TableBody>
            {resultRows.length === 0 && !loadingResults ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    {s.noAuditResults}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {resultRows.map((row) => {
              const auditDate = row.analyzedAt ?? row.completedAt
              const when = auditDate !== undefined ? moment(auditDate) : null
              const auditorLabel = resolveCallAuditUserLabel(row.auditorUserId, usersOriginal)
              const callerLabel = resolveCallAuditUserLabel(row.agentExternalRef, usersOriginal)
              const indicatorsLabel = formatIndicatorsCell(row)
              const failedTooltip = formatFailedTooltip(row)
              const notes = (row.reviewerNotes ?? "").trim()
              return (
                <TableRow key={row.callLogId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {auditorLabel}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {callerLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {row.callSid}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {when !== null ? when.format("DD/MM/YY HH:mm") : "—"}
                  </TableCell>
                  <TableCell>
                    {failedTooltip !== "" ? (
                      <Tooltip title={`${s.failedIndicatorsTooltip}: ${failedTooltip}`}>
                        <Typography
                          variant="body2"
                          aria-label={`${indicatorsLabel} ${s.checklistSummary}. ${s.failedIndicatorsTooltip}: ${failedTooltip}`}
                        >
                          {indicatorsLabel} {s.checklistSummary}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" aria-label={`${indicatorsLabel} ${s.checklistSummary}`}>
                        {indicatorsLabel} {s.checklistSummary}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notes !== "" ? notes : s.noReviewerNotes}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={s.viewAudit}>
                      <IconButton
                        size="small"
                        aria-label={s.viewAudit}
                        onClick={() =>
                          setAuditDialog({
                            callLogId: row.callLogId,
                            callRow: buildCallRowFromCompleted(row),
                          })
                        }
                        sx={{ cursor: "pointer" }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {auditDialog !== null ? (
        <CallAuditFormDialogCP
          open
          callLogId={auditDialog.callLogId}
          callRow={auditDialog.callRow}
          onClose={() => setAuditDialog(null)}
        />
      ) : null}
    </>
  )
}
